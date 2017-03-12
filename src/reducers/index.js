import { combineReducers } from 'redux'
import job from 'reducers/job'
import errors from 'reducers/errors'
import videos from 'reducers/videos'

const initial = {
  analyze: {
    link: 'http://youtu.be/ABCD',
    pause: false
  },
  result: {
    type: 'p',
    length: 10
  },
  errors: [],
  videos: []
}

const epydApp = combineReducers({
  job,
  errors,
  videos
})

export default epydApp
