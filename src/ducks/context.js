import { combineEpics } from 'redux-observable'
import Rx from 'rxjs/Rx'
import yapi from 'services/yapi'
import smoothScroll from 'smoothscroll'
import * as videoDuck from 'ducks/video'
import * as videosDuck from 'ducks/videos'
import * as errorDuck from 'ducks/error'
import * as errorsDuck from 'ducks/errors'

// Actions
const ANALYZE = 'epyd/context/ANALYZE'
const PROCESS = 'epyd/context/PROCESS'
const FILL = 'epyd/context/FILL'
const BUFFERIZE = 'epyd/context/BUFFERIZE'
const CLEAR = 'epyd/context/CLEAR'

// Regexps
const YOUTUBE_VIDEO_REGEXP = /(youtu\.?be(\.com)?\/)(watch|embed|v)?(\/|\?)?(.*?v=)?([^#\&\?\=]{11})/
const YOUTUBE_PLAYLIST_REGEXP = /(youtube\.com\/)(watch|playlist)(.*?list=)([^#\&\?\=]{18,34})/

// Managers
const stoper$ = new Rx.Subject()
const pauser$ = new Rx.Subject()

// Reducer
const initial = {
  subject: null,
  total: null,
  paused: false,
  downloading: false
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case ANALYZE:
      return Object.assign({}, initial, {
        subject: action.link
      })
    case FILL:
      let {total} = action
      return Object.assign({}, state, {
        total
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
export const analyzeSubject = (link) => ({
  type: ANALYZE,
  link
})

export const processSubject = (kind, id) => ({
  type: PROCESS,
  kind,
  id
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
  analyzeSubjectEpic,
  processSubjectEpic,
  fillContextEpic,
  togglePauseEpic
)

export function analyzeSubjectEpic(action$){
  const stop$ = action$.ofType(PROCESS)
    .do(() => stoper$.next(true))
    .mergeMap(() => Rx.Observable.of(errorsDuck.clearErrors(), videosDuck.clearVideos()))

  const process$ = action$.ofType(ANALYZE)
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
      .map(next => Array.isArray(next) ? processSubject(...next) : next)
      .catch(error => Rx.Observable.of(
        errorsDuck.clearErrors(),
        videosDuck.clearVideos(),
        errorDuck.includeError('context', error.message, true),
        fillContext(1) // total : 1 error, this one
      ))
    )

  return Rx.Observable.merge(stop$, process$)
}

export function processSubjectEpic(action$){
  const about$ = action$.ofType(PROCESS)
    .mergeMap(action => yapi.total(action.id))
    .map(total => fillContext(total))

  const videos$ = action$.ofType(PROCESS)
    .delay(1000)
    .mergeMap(action => (action.kind === 'p' ? yapi.playlist(action.id) : yapi.videos(action.id))
      .pausableBuffered(pauser$)
      .takeUntil(stoper$)
    )
    .map(next => typeof next === 'object' && next.constructor.name === 'Error' ? errorDuck.includeError('context', next.message, true) : videoDuck.includeVideo(next))

  return Rx.Observable.merge(about$, videos$)
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
