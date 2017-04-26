import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import analyze, { epic as analyzeEpic } from 'ducks/analyze'
import errors from 'ducks/errors'
import videos, { epic as videosEpic } from 'ducks/videos'

export const reducer = combineReducers({
  analyze,
  errors,
  videos
})

export const epic = combineEpics(
  analyzeEpic,
  videosEpic
)
