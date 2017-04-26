import { combineEpics } from 'redux-observable'
import Rx from 'rxjs/Rx'
import yapi from 'services/yapi'
import { includeVideo } from 'ducks/video'
import { clearVideos } from 'ducks/videos'
import { clearErrors, receiveError } from 'ducks/errors'

// Actions
const PROCESS = 'epyd/analyze/PROCESS'
const FILL = 'epyd/analyze/FILL'
const BUFFERIZE = 'epyd/analyze/BUFFERIZE'

// Managers
const stoper$ = new Rx.Subject()
const pauser$ = new Rx.Subject()

// Reducer
const initial = {
  total: null,
  paused: false
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case PROCESS:
      return {
        total: null,
        paused: false
      }
    case FILL:
      let {total} = action
      return Object.assign({}, state, {
        total
      })
    case BUFFERIZE:
      return Object.assign({}, state, {
        paused: !state.paused
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

export const fillAnalyze = (total) => ({
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
    .mergeMap(() => Rx.Observable.of(clearErrors(), clearVideos()))

  const about$ = action$.ofType(PROCESS)
    .mergeMap(action => yapi.total(action.id))
    .map(total => fillAnalyze(total))

  const videos$ = action$.ofType(PROCESS)
    .mergeMap(action => (action.kind === 'p' ? yapi.playlist(action.id) : yapi.videos(action.id))
      .pausableBuffered(pauser$)
      .takeUntil(stoper$)
    )
    .map(raw => typeof raw === 'string' ? receiveError(raw, 'YOUTUBE_VIDEO_UNAVAILABLE') : includeVideo(raw))

  return Rx.Observable.merge(stop$, about$, videos$)
}

export function togglePauseEpic(action$, store){
  return action$.ofType(BUFFERIZE)
    .do(() => pauser$.next(store.getState().analyze.paused))
    .mergeMap(() => Rx.Observable.never())
}
