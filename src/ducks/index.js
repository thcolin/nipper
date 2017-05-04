import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import context, { epic as contextEpic } from 'ducks/context'
import errors from 'ducks/errors'
import videos, { epic as videosEpic } from 'ducks/videos'

export const reducer = combineReducers({
  context,
  errors,
  videos
})

export const epic = combineEpics(
  contextEpic,
  videosEpic
)
