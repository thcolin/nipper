import { combineEpics, ofType } from 'redux-observable'
import { of, fromEvent, NEVER } from 'rxjs'
import { map, filter, tap, mergeMap } from 'rxjs/operators'
import * as apiDuck from 'store/ducks/api'
import * as diggerDuck from 'store/ducks/digger'
import * as toasterDuck from 'store/ducks/toaster'

// Epics
const bootstrapLocationEpic = (action$) => action$.pipe(
  ofType(apiDuck.BOOTSTRAP),
  mergeMap(() => {
    const kind = window.location.hash.substr(1, 1)
    const id = window.location.hash.substr(2)
    const fulfilled = (['v', 'p'].includes(kind) && id !== '')

    if (fulfilled) {
      return of(diggerDuck.doDig(`youtube#${{ p: 'playlist', v: 'video' }[kind]}#${id}`))
    } else {
      history.replaceState(null, document.title, '/')
      return NEVER
    }
  })
)

const listenLocationEpic = (action$) => fromEvent(window, 'popstate').pipe(
  mergeMap(() => {
    const kind = window.location.hash.substr(1, 1)
    const id = window.location.hash.substr(2)
    const fulfilled = (['v', 'p'].includes(kind) && id !== '')

    if (fulfilled) {
      return of(
        diggerDuck.clearDigger(),
        toasterDuck.clearToaster(),
        diggerDuck.doDig(`youtube#${{ p: 'playlist', v: 'video' }[kind]}#${id}`)
      )
    } else {
      history.replaceState(null, document.title, '/')
      return of(diggerDuck.clearDigger())
    }
  })
)

const syncLocationEpic = (action$) => action$.pipe(
  ofType(diggerDuck.RECORD),
  map(action => `#${action.record.kind.charAt(0)}${action.record.id}`),
  filter(hash => window.location.hash !== hash),
  tap(hash => history.pushState(null, document.title, hash)),
  mergeMap(() => NEVER)
)

const clearLocationEpic = (action$) => action$.pipe(
  ofType(diggerDuck.CLEAR),
  filter(action => [diggerDuck.SHUT, diggerDuck.CLEAR].includes(action.type)),
  filter(action => action.type !== diggerDuck.SHUT || action.error),
  tap(() => history.replaceState(null, document.title, '/')),
  mergeMap(() => NEVER)
)

export const epic = combineEpics(
  bootstrapLocationEpic,
  listenLocationEpic,
  syncLocationEpic,
  clearLocationEpic
)
