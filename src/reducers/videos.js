const videos = (state = [], action) => {
  switch(action.type){
    case 'RECEIVE_ANALYZE':
      return []
    case 'RECEIVE_VIDEO':
      var videos = state.slice()
      videos.push(action.video)
      return videos
    case 'SHIFT_VIDEO':
      return state.map(v => {
        if(v.id === action.id){
          v.selected = !v.selected
        }

        return v
      })
    case 'SHIFT_VIDEOS':
      return state.map(v => {
        v.selected = action.to
        return v
      })
    case 'EDIT_VIDEO':
      return state.map(v => {
        if(v.id === action.id){
          v.id3[action.key] = action.value
        }

        return v
      })
    default:
      return state
  }
}

export default videos
