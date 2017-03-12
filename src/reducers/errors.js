const videos = (state = [{id: 1}, {id: 2}], action) => {
  console.log('errors', state, action)
  switch (action.type) {
    case 'CLOSE_ERROR':
      return state.filter(e => e.id !== action.id)
    default:
      return state
  }
}

export default videos
