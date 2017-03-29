import { combineReducers } from 'redux'
import analyze from 'reducers/analyze'
import errors from 'reducers/errors'
import videos from 'reducers/videos'

const initial = {
  analyze: {
    id: 'FLj9CxlpVDiacX7ZlzuLuGiQ', // or null
    kind: 'p', // or null
    pause: false,
    total: 10, // or null
    token: 'CAUQAA' // or null
  },
  errors: [
    {
      id: 1,
      message: 'Hello World !'
    }
  ],
  videos: [
    {
      id: 'Y2vVjlT306s',
      selected: false,
      details: {
        title: 'HELLO WORLD !',
        author: 'helloWorld',
        channel: 'UCj9CxlpVDiacX7ZlzuLuGiQ',
        description: 'Hello World !',
        thumbnail: 'https://i.ytimg.com/vi/ryti_lCKleA/sddefault.jpg', // CAUTION : 'sddefault' isn't available for all videos
        duration: 'PT3M11S'
      },
      statistics: {
        views: 0,
        likes: 0,
        dislikes: 0
      },
      id3: {
        song: 'Hello',
        artist: 'World',
        cover: 'https://i.ytimg.com/vi/ryti_lCKleA/sddefault.jpg'
      }
    }
  ]
}

const epydApp = combineReducers({
  analyze,
  errors,
  videos
})

export default epydApp
