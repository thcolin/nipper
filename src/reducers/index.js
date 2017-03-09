import { combineReducers } from 'redux'
import downloading from 'reducers/downloading'
import videos from 'reducers/videos'

const epydApp = combineReducers({
  downloading,
  videos
})

export default epydApp
