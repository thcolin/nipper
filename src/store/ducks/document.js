import { combineEpics, ofType } from 'redux-observable'
import { filter, tap, mergeMap, delay } from 'rxjs/operators'
import { NEVER } from 'rxjs'
import * as apiDuck from 'store/ducks/api'
import * as diggerDuck from 'store/ducks/digger'

// Epics
const scrollDocumentEpic = (action$) => action$.pipe(
  ofType(diggerDuck.DO),
  delay(200),
  tap(() => document.querySelector('#toolbar').scrollIntoView({ block: 'start', behavior: 'smooth' })),
  mergeMap(() => NEVER)
)

const syncDocumentEpic = (action$) => action$.pipe(
  ofType(diggerDuck.RECORD),
  tap(action => document.title = `Nipper - ${action.record.title} (${action.record.author}) - 🌶 💽️`), // eslint-disable-line no-return-assign
  mergeMap(() => NEVER)
)

const clearDocumentEpic = (action$) => action$.pipe(
  filter(action => [apiDuck.BOOTSTRAP, diggerDuck.DO, diggerDuck.SHUT, diggerDuck.CLEAR].includes(action.type)),
  filter(action => action.type !== diggerDuck.SHUT || action.error),
  tap(action => {
    document.title = 'Nipper - YouTube playlist (& video) ripper - 🌶 💽️'

    if (action.type === diggerDuck.CLEAR || action.type === diggerDuck.SHUT) {
      document.querySelector('#landing').scrollIntoView({ behavior: 'smooth' })
    }
  }),
  mergeMap(() => NEVER)
)

export const epic = combineEpics(
  scrollDocumentEpic,
  syncDocumentEpic,
  clearDocumentEpic
)
