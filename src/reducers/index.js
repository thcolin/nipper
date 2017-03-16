import { combineReducers } from 'redux'
import job from 'reducers/job'
import errors from 'reducers/errors'
import videos from 'reducers/videos'

const initial = {
  analyze: {
    id: 'FLj9CxlpVDiacX7ZlzuLuGiQ', // https://www.youtube.com/playlist?list=
    kind: 'p',
    // id: 'Y2vVjlT306s', // https://www.youtube.com/watch?v=
    // kind: 'v',
    pause: false,
    total: 10
  },
  errors: [],
  videos: []
}

// https://developers.google.com/apis-explorer/
// https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=FLj9CxlpVDiacX7ZlzuLuGiQ&key={YOUR_API_KEY}
// https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails,statistics&id=Y2vVjlT306s&key={YOUR_API_KEY}

const epydApp = combineReducers({
  job,
  errors,
  videos
})

export default epydApp
