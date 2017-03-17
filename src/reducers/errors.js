const videos = (state = [], action) => {
  switch (action.type) {
    case 'CLOSE_ERROR':
      return state.filter(e => e.id !== action.id)
    default:
      return state
  }
}

export default videos
