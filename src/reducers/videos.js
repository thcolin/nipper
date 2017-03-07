const videos = (state = [], action) => {
  switch (action.type) {
    case 'ANALYZE':
      console.log(state, action)
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
    default:
      return state
  }
}

export default videos
