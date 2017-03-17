import epyd from 'epyd'

const video = (state, action) => {
  if(state.id !== action.id){
    return state
  }

  switch (action.type) {
    case 'SHIFT_VIDEO':
      return Object.assign({}, state, {
        selected: action.to
      })
    case 'DOWNLOAD_VIDEO':
      return state
    default:
      return state
  }
}

const videos = (state = [], action) => {
  switch (action.type) {
    case 'ANALYZE':
      var videos = []
      if(action.kind === 'v'){
        // video
        videos.push({
          id: 'Y2vVjlT306s',
          selected: false,
          details: {
            title: 'HELLO WORLD !',
            author: 'helloWorld',
            channel: 'UCj9CxlpVDiacX7ZlzuLuGiQ',
            description: 'Hello World !',
            thumbnail: 'https://i.ytimg.com/vi/ryti_lCKleA/sddefault.jpg',
            duration: ''
          },
          statistics: {
            views: 0,
            likes: 0,
            dislikes: 0
          },
          id3: {
            artist: 'Hello',
            title: 'World'
          }
        })
        // epyd.video(action.id)
      } else if(action.kind === 'p'){
        // playlist
        videos.push({
          id: 'Y2vVjlT306s',
          selected: false,
          details: {
            title: 'HELLO WORLD !',
            author: 'helloWorld',
            channel: 'UCj9CxlpVDiacX7ZlzuLuGiQ',
            description: 'Hello World !',
            thumbnail: 'https://i.ytimg.com/vi/ryti_lCKleA/sddefault.jpg',
            duration: ''
          },
          statistics: {
            views: 0,
            likes: 0,
            dislikes: 0
          },
          id3: {
            artist: 'Hello',
            title: 'World'
          }
        })
        // epyd.playlist(action.id)
      }
      return videos
    case 'TOGGLE_VIDEOS':
      return state.map(e => {
        e.selected = action.to
        return e
      })
    case 'SHIFT_VIDEO':
    case 'DOWNLOAD_VIDEO':
      return state.map(e =>
        video(e, action)
      )
    case 'DOWNLOAD_SELECTION':
      return state
    default:
      return state
  }
}

export default videos
