import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import context, { epic as contextEpic } from 'ducks/context'
import errors from 'ducks/errors'
import videos, { epic as videosEpic } from 'ducks/videos'
import records, { epic as recordsEpic } from 'ducks/records'

export const reducer = combineReducers({
  context,
  errors,
  videos,
  records
})

export const epic = combineEpics(
  contextEpic,
  videosEpic,
  recordsEpic,
)
