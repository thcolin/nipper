import { combineEpics } from 'redux-observable'
import Rx from 'rxjs/Rx'
import gloader from 'services/gloader'
import yapi from 'services/yapi'
import config from 'config'
import smoothScroll from 'smoothscroll'
import createHistory from 'history/createHashHistory'
import * as videoDuck from 'ducks/video'
import * as videosDuck from 'ducks/videos'
import * as errorDuck from 'ducks/error'
import * as errorsDuck from 'ducks/errors'

// Actions
export const INITIALIZE = 'epyd/context/INITIALIZE'
export const BOOTSTRAP = 'epyd/context/BOOTSTRAP'
export const ANALYZE = 'epyd/context/ANALYZE'
export const PROCESS = 'epyd/context/PROCESS'
export const CONFIGURE = 'epyd/context/CONFIGURE'
export const FILL = 'epyd/context/FILL'
export const BUFFERIZE = 'epyd/context/BUFFERIZE'
export const CLEAR = 'epyd/context/CLEAR'

// Regexps
const YOUTUBE_VIDEO_REGEXP = /(youtu\.?be(\.com)?\/)(watch|embed|v)?(\/|\?)?(.*?v=)?([^#\&\?\=]{11})/
const YOUTUBE_PLAYLIST_REGEXP = /(youtube\.com\/)(watch|playlist)(.*?list=)([^#\&\?\=]{18,34})/

// URLs
const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=__ID__'
const YOUTUBE_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=__ID__'
const YOUTUBE_URLS = {
  v: YOUTUBE_VIDEO_URL,
  p: YOUTUBE_PLAYLIST_URL
}

// History
const history = createHistory({
  hashType: 'noslash'
})

// Managers
const stoper$ = new Rx.Subject()
const pauser$ = new Rx.Subject()

// Reducer
const initial = {
  subject: '',
  format: 'mp3',
  total: null,
  ready: true,
  paused: false,
  downloading: false
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case INITIALIZE:
      return Object.assign({}, state, {
        ready: false
      })
    case BOOTSTRAP:
      return Object.assign({}, state, {
        ready: true
      })
    case ANALYZE:
      return Object.assign({}, initial, {
        subject: action.link
      })
    case CONFIGURE:
      return Object.assign({}, state, {
        format: action.format
      })
    case FILL:
      return Object.assign({}, state, {
        total: action.total
      })
    case BUFFERIZE:
      return Object.assign({}, state, {
        paused: !state.paused
      })
    case CLEAR:
      return initial
    case videosDuck.DOWNLOAD:
      return Object.assign({}, state, {
        downloading: !state.downloading
      })
    default:
      return state
  }
}

// Actions Creators
export const initializeContext = () => ({
  type: INITIALIZE
})

export const bootstrapContext = () => ({
  type: BOOTSTRAP
})

export const analyzeSubject = (link) => ({
  type: ANALYZE,
  link
})

export const processSubject = (kind, id) => ({
  type: PROCESS,
  kind,
  id
})

export const configureContext = (format) => ({
  type: CONFIGURE,
  format
})

export const fillContext = (total) => ({
  type: FILL,
  total
})

export const togglePause = () => ({
  type: BUFFERIZE
})

export const clearContext = () => ({
  type: CLEAR
})

// Epics
export const epic = combineEpics(
  initializeContextEpic,
  bootstrapContextEpic,
  analyzeSubjectEpic,
  processSubjectEpic,
  fillContextEpic,
  togglePauseEpic,
  clearContextEpic
)

export function initializeContextEpic(action$){
  return action$.ofType(INITIALIZE)
    .mergeMap(() => Rx.Observable.fromPromise(
      gloader.then(gapi => gapi.client.setApiKey(config.apiKey))
    ))
    .map(() => bootstrapContext())
}

export function bootstrapContextEpic(action$, store){
  return Rx.Observable.merge(
      action$.ofType(BOOTSTRAP),
      Rx.Observable.fromHistory(history)
        .filter(next => next.action === 'POP') // only user changes
    )
    .map(() => window.location.hash)
    .do(() => document.title = 'epyd.js - Smooth Youtube Downloadr')
    .mergeMap(hash => Rx.Observable.of(hash)
      .filter(hash => hash)
      .map(hash => {
        var kind = hash.substr(1, 1)
        var id = hash.substr(2)

        if(!['p', 'v'].includes(kind)){
          throw new Error('Unknown **hash params kind** (v for video, or p for playlist)')
        }

        return { kind, id }
      })
      .map(next => analyzeSubject(YOUTUBE_URLS[next.kind].replace(/__ID__/, next.id)))
      .catch(error => Rx.Observable.of(clearContext()))
    )
}

export function analyzeSubjectEpic(action$){
  return action$.ofType(ANALYZE)
    .mergeMap(action => Rx.Observable.of(action) // wrap is needed to continue returned Observable
      .map(action => {
        if(YOUTUBE_PLAYLIST_REGEXP.test(action.link)){
          return ['p', YOUTUBE_PLAYLIST_REGEXP.exec(action.link)[4]]
        }

        if(YOUTUBE_VIDEO_REGEXP.test(action.link)){
          return ['v', YOUTUBE_VIDEO_REGEXP.exec(action.link)[6]]
        }

        throw new Error('Submited link is **not valid**, you need to provide a **Youtube** video or playlist link')
      })
      .map(next => processSubject(...next))
      .catch(error => Rx.Observable.of(
        errorsDuck.clearErrors(),
        videosDuck.clearVideos(),
        errorDuck.includeError('context', error.message, true),
        fillContext(1) // yep, the error above
      ))
    )
}

export function processSubjectEpic(action$){
  const stop$ = Rx.Observable.merge(
      action$.ofType(CLEAR),
      action$.ofType(PROCESS)
    )
    .do(() => stoper$.next(true))
    .mergeMap(() => Rx.Observable.of(
      errorsDuck.clearErrors(),
      videosDuck.clearVideos()
    ))

  const process$ = action$.ofType(PROCESS)
    .do(action => history.location.pathname === '/' + action.kind + action.id ? null : history.push(action.kind + action.id))
    .mergeMap(action => {
      const results$ = (action.kind === 'p' ? yapi.playlist(action.id) : yapi.videos(action.id))

      return Rx.Observable.merge(
        results$.about
          .do(about => document.title = 'epyd.js - "' + about.items[0].snippet.title + '" from ' + about.items[0].snippet.channelTitle)
          .map(about => fillContext(about.items[0].contentDetails.itemCount || about.pageInfo.totalResults))
          .catch(error => Rx.Observable.of(
            errorDuck.includeError('context', 'Youtube ' + {'p': 'playlist', 'v': 'video'}[action.kind] + ' **' + action.id + '** is unavailable', true),
            fillContext(1) // yep, the error above
          )),
        results$.items
          .delay(1000)
          .pausableBuffered(pauser$)
          .takeUntil(stoper$)
          .filter(next => !(action.kind === 'v' && typeof next === 'object' && next.constructor.name === 'Error')) // avoid having about error twice for video subject
          .map(next => typeof next === 'object' && next.constructor.name === 'Error' ? errorDuck.includeError('context', next.message, true) : videoDuck.includeVideo(next))
          .catch(() => Rx.Observable.never())
      )
    })

  return Rx.Observable.merge(stop$, process$)
}

export function fillContextEpic(action$){
  return action$.ofType(FILL)
    .delay(100)
    .do(() => smoothScroll(document.querySelector('.toolbar')))
    .mergeMap(() => Rx.Observable.never())
}

export function togglePauseEpic(action$, store){
  return action$.ofType(BUFFERIZE)
    .do(() => pauser$.next(store.getState().context.paused))
    .mergeMap(() => Rx.Observable.never())
}

export function clearContextEpic(action$){
  return action$.ofType(CLEAR)
    .do(() => history.push(''))
    .do(() => document.title = 'epyd.js - Smooth Youtube Downloadr')
    .mergeMap(() => Rx.Observable.never())
}
