import { combineEpics } from 'redux-observable'
import Rx from 'rxjs/Rx'
import yapi from 'services/yapi'
import * as videoDuck from 'ducks/video'
import * as videosDuck from 'ducks/videos'
import * as errorsDuck from 'ducks/errors'

// Actions
const PROCESS = 'epyd/context/PROCESS'
const FILL = 'epyd/context/FILL'
const BUFFERIZE = 'epyd/context/BUFFERIZE'

// Managers
const stoper$ = new Rx.Subject()
const pauser$ = new Rx.Subject()

// Reducer
const initial = {
  total: null,
  paused: false,
  downloading: false
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case PROCESS:
      return initial
    case FILL:
      let {total} = action
      return Object.assign({}, state, {
        total
      })
    case BUFFERIZE:
      return Object.assign({}, state, {
        paused: !state.paused
      })
    case videosDuck.DOWNLOAD:
      return Object.assign({}, state, {
        downloading: !state.downloading
      })
    default:
      return state
  }
}

// Actions Creators
export const processAnalyze = (kind, id) => ({
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

// Epics
export const epic = combineEpics(
  processAnalyzeEpic,
  togglePauseEpic
)

export function processAnalyzeEpic(action$){
  const stop$ = action$.ofType(PROCESS)
    .do(() => stoper$.next(true))
    .mergeMap(() => Rx.Observable.of(errorsDuck.clearErrors(), videosDuck.clearVideos()))

  const about$ = action$.ofType(PROCESS)
    .mergeMap(action => yapi.total(action.id))
    .map(total => fillContext(total))

  const videos$ = action$.ofType(PROCESS)
    .mergeMap(action => (action.kind === 'p' ? yapi.playlist(action.id) : yapi.videos(action.id))
      .pausableBuffered(pauser$)
      .takeUntil(stoper$)
    )
    .map(raw => typeof raw === 'string' ? errorsDuck.receiveError(raw, 'YOUTUBE_VIDEO_UNAVAILABLE') : videoDuck.includeVideo(raw))

  return Rx.Observable.merge(stop$, about$, videos$)
}

export function togglePauseEpic(action$, store){
  return action$.ofType(BUFFERIZE)
    .do(() => pauser$.next(store.getState().context.paused))
    .mergeMap(() => Rx.Observable.never())
}
