import { combineEpics, ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { tap, mergeMap, mapTo, catchError } from 'rxjs/operators'
import gloader from 'store/utils/gloader'

// Actions
export const INIT = 'nipper/api/INIT'
export const BOOTSTRAP = 'nipper/api/BOOTSTRAP'
export const BREAK = 'nipper/api/BREAK'

// Reducer
const initial = {
  ready: false,
  broken: false
}

export default function reducer (state = initial, action = {}) {
  switch (action.type) {
    case INIT:
      return {
        ...initial
      }
    case BOOTSTRAP:
      return {
        ...state,
        ready: true
      }
    case BREAK:
      return {
        ...state,
        broken: true
      }
    default:
      return state
  }
}

// Actions Creators
export const initApi = () => ({
  type: INIT
})

export const bootstrapApi = () => ({
  type: BOOTSTRAP
})

export const breakApi = () => ({
  type: BREAK
})

// Epics
const initApiEpic = (action$) => action$.pipe(
  ofType(INIT),
  mergeMap(() => from(gloader()).pipe(
    tap(gapi => gapi.client.setApiKey(process.env.YOUTUBE_API_KEY)),
    mapTo(bootstrapApi()),
    catchError(() => of(breakApi()))
  ))
)

export const epic = combineEpics(
  initApiEpic
)
