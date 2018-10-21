import { combineEpics, ofType } from 'redux-observable'
import { NEVER } from 'rxjs'
import { map, filter, tap, mergeMap } from 'rxjs/operators'
import * as apiDuck from 'store/ducks/api'
import * as diggerDuck from 'store/ducks/digger'
import * as libraryDuck from 'store/ducks/library'

// Epics
const bootstrapStorageEpic = (action$) => action$.pipe(
  ofType(apiDuck.BOOTSTRAP),
  map(library => libraryDuck.importLibrary(JSON.parse(localStorage.library || '{}')))
)

const syncStorageEpic = (action$, state$) => action$.pipe(
  filter(action => [diggerDuck.RECORD, diggerDuck.SHUT].includes(action.type)),
  tap(() => localStorage.library = JSON.stringify(state$.value.library)), // eslint-disable-line no-return-assign
  mergeMap(() => NEVER)
)

export const epic = combineEpics(
  bootstrapStorageEpic,
  syncStorageEpic
)
