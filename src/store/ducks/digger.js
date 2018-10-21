import { combineEpics, ofType } from 'redux-observable'
import { of, concat } from 'rxjs'
import { bufferCount, pluck, filter, mergeMap, takeUntil, catchError, delay } from 'rxjs/operators'
import * as toasterDuck from 'store/ducks/toaster'
import services from 'store/services'

// Actions
export const DO = 'nipper/digger/DO'
export const SHUT = 'nipper/digger/SHUT'
export const REMOVE = 'nipper/digger/REMOVE'
export const CLEAR = 'nipper/digger/CLEAR'
export const RECORD = 'nipper/digger/RECORD'
export const TRACKS = 'nipper/digger/TRACKS'
export const ERRORS = 'nipper/digger/ERRORS'

// Reducer
const initial = {
  // 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
  //   uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
  //   service: 'youtube',
  //   kind: 'playlist',
  //   id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
  //   done: false,
  // },
}

export default function reducer (state = initial, action = {}) {
  switch (action.type) {
    case DO:
      return {
        ...state,
        [action.uri]: action.job
      }
    case SHUT:
      return {
        ...state,
        [action.uri]: {
          ...state[action.uri],
          done: true,
          error: action.error
        }
      }
    case REMOVE:
      return Object.values(state)
        .filter(job => job.id !== action.uri)
        .reduce((jobs, job) => ({ ...jobs, [job.uri]: job }), {})
    case CLEAR:
      return {
        ...initial
      }
    default:
      return state
  }
}

// Actions Creators
export const doDig = (uri) => ({
  type: DO,
  uri,
  job: {
    uri,
    service: uri.split('#')[0],
    kind: uri.split('#')[1],
    id: uri.split('#')[2],
    done: false,
    error: null
  }
})

export const shutDig = (uri, error = null) => ({
  type: SHUT,
  uri,
  error
})

export const removeDig = (uri) => ({
  type: REMOVE,
  uri
})

export const clearDigger = () => ({
  type: CLEAR
})

export const emitRecord = (uri, { subject, ...record }) => ({
  type: RECORD,
  uri,
  record: {
    ...record,
    uri,
    kind: subject
  }
})

export const emitTracks = (uri, tracks) => ({
  type: TRACKS,
  uri,
  tracks
})

export const emitErrors = (uri, errors) => ({
  type: ERRORS,
  uri,
  errors
})

// Epics
export const doDigEpic = (action$) => action$.pipe(
  ofType(DO),
  delay(500),
  pluck('job'),
  mergeMap(job => (
    concat(
      services[job.service][job.kind](job.id).pipe(
        bufferCount(50),
        mergeMap(items => {
          const records = items.filter(item => item.kind === 'record').map(item => emitRecord(job.uri, item))
          const tracks = items.filter(item => item.kind === 'track')
          const errors = items.filter(item => item.kind === 'error')

          return of(
            ...records,
            ...(tracks.length ? [emitTracks(job.uri, tracks)] : []),
            ...(errors.length ? [emitErrors(job.uri, errors)] : [])
          )
        })
      ),
      of(shutDig(job.uri))
    ).pipe(
      takeUntil(action$.pipe(
        filter(next => [SHUT, REMOVE, CLEAR].includes(next.type) && (!next.uri || (next.uri === job.uri)))
      )),
      catchError(error => of(
        shutDig(job.uri, error),
        (typeof error === 'string' ? toasterDuck.tapeToast('error', error, 'doDig', true) : null)
      ))
    )
  ))
)

export const epic = combineEpics(
  doDigEpic
)
