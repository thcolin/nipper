const videos = (state = [], action) => {
  console.log('videos', state, action)
  switch (action.type) {
    case 'ANALYZE':
      var videos = []
      if(action.model === 'v'){
        // video
        videos.push({id: 1})
      } else if(action.model === 'p'){
        // playlist
        videos.push({id: 1})
        videos.push({id: 2})
      }
      return videos
    case 'TOGGLE_VIDEOS':
      return state.map(e => {
        e.selected = action.to
        return e
      })
    case 'DOWNLOAD_SELECTION':
      return state.map(e => e)
    default:
      return state
  }
}

export default videos
