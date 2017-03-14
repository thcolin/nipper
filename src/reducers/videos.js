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

const videos = (state = [{id: 1, selected: false}, {id: 2, selected: false}, {id: 3, selected: false}, {id: 4, selected: false}], action) => {
  console.log('videos', state, action)
  switch (action.type) {
    case 'ANALYZE':
      var videos = []
      if(action.kind === 'v'){
        // video
        videos.push({id: 1})
        epyd.video(action.id)
      } else if(action.kind === 'p'){
        // playlist
        videos.push({id: 1})
        videos.push({id: 2})
        epyd.playlist(action.id)
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
