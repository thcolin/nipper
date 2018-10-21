import { combineReducers, compose, applyMiddleware, createStore } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import api, { epic as apiEpic, initApi } from 'store/ducks/api'
import { epic as databaseEpic } from 'store/ducks/database'
import digger, { epic as diggerEpic } from 'store/ducks/digger'
import downloader, { epic as downloaderEpic } from 'store/ducks/downloader'
import library from 'store/ducks/library'
import preferences from 'store/ducks/preferences'
import selection from 'store/ducks/selection'
import toaster from 'store/ducks/toaster'
import { epic as documentEpic } from 'store/ducks/document'
import { epic as locationEpic } from 'store/ducks/location'
import { epic as saverEpic } from 'store/ducks/saver'
import { epic as storageEpic } from 'store/ducks/storage'

const reducer = combineReducers({
  api,
  digger,
  downloader,
  library,
  preferences,
  selection,
  toaster
})

const epic = combineEpics(
  apiEpic,
  databaseEpic,
  diggerEpic,
  downloaderEpic,

  documentEpic,
  locationEpic,
  saverEpic,
  storageEpic
)

const epicMiddleware = createEpicMiddleware()
const composeEnhancers = (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      epicMiddleware
    )
  )
)

epicMiddleware.run(epic)
store.dispatch(initApi())

export default store
