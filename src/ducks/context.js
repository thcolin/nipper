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
export const INSPECT = 'epyd/context/INSPECT'
export const CONFIGURE = 'epyd/context/CONFIGURE'
export const FILL = 'epyd/context/FILL'
export const CLEAR = 'epyd/context/CLEAR'

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

// Reducer
const initial = {
  subject: '',
  format: 'mp3',
  total: null,
  ready: true,
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
    case INSPECT:
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

export const inspectSubject = (link) => ({
  type: INSPECT,
  link
})

export const configureContext = (format) => ({
  type: CONFIGURE,
  format
})

export const fillContext = (total) => ({
  type: FILL,
  total
})

export const clearContext = () => ({
  type: CLEAR
})

// Epics
export const epic = combineEpics(
  initializeContextEpic,
  bootstrapContextEpic,
  inspectSubjectEpic,
  fillContextEpic,
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
    .map(() => {
      document.title = 'epyd.js - Smooth Youtube Downloadr'
      return window.location.hash
    })
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
      .map(next => inspectSubject(YOUTUBE_URLS[next.kind].replace(/__ID__/, next.id)))
      .catch(error => Rx.Observable.of(clearContext()))
    )
}

export function inspectSubjectEpic(action$){
  const stop$ = Rx.Observable.merge(
      action$.ofType(CLEAR),
      action$.ofType(INSPECT)
    )
    .mergeMap(() => {
      stoper$.next(true)
      return Rx.Observable.of(
        errorsDuck.clearErrors(),
        videosDuck.clearVideos()
      )
    })

  const process$ = action$.ofType(INSPECT)
    .mergeMap(action => {
      const results$ = yapi(action.link, 50, 100)

      const about$ = results$.about
        .map(about => {
          const pathname = { 'youtube#playlist': 'p', 'youtube#video': 'v' }[about.kind] + about.id
          document.title = 'epyd.js - "' + about.snippet.title + '" from ' + about.snippet.channelTitle

          if (history.location.pathname !== '/' + pathname) {
            history.push(pathname)
          }

          return fillContext(about.contentDetails.itemCount)
        })
        .catch(error => Rx.Observable.of(
          errorDuck.includeError('context', error.message, true),
          fillContext(1) // yep, the error above
        ))

      const items$ = results$.items
        .takeUntil(stoper$)
        .mergeMap(item => {
          if (item.constructor.name === 'Error') {
            return Rx.Observable.of(item)
          } else {
            const video = videoDuck.parseVideo(item).video

            return Rx.Observable.ajax({
                url: video.details.thumbnail,
                responseType: 'blob'
              })
              .map(data => Object.assign(video, {
                tags: {
                  ...video.tags,
                  cover: data.response
                }
              }))
          }
        })
        .bufferCount(7)
        .mergeMap(items => {
          const next = []
          const videos = items.filter(item => item.constructor.name !== 'Error')
          const errors = items.filter(item => item.constructor.name === 'Error')

          if (videos.length > 0) {
            next.push(videosDuck.includeVideos(videos))
          }

          if (errors.length > 0) {
            next.push(errorsDuck.includeErrors('context', errors, true))
          }

          return Rx.Observable.from(next)
        })

      return Rx.Observable.merge(about$, items$)
    })

  return Rx.Observable.merge(stop$, process$)
}

export function fillContextEpic(action$){
  return action$.ofType(FILL)
    .delay(100)
    .mergeMap(() => {
      smoothScroll(document.querySelector('.toolbar'))
      return Rx.Observable.never()
    })
}

export function clearContextEpic(action$){
  return action$.ofType(CLEAR)
    .mergeMap(() => {
      history.push('')
      document.title = 'epyd.js - Smooth Youtube Downloadr'
      return Rx.Observable.never()
    })
}
