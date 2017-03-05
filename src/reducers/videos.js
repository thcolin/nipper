const videos = (state = [], action) => {
  switch (action) {
    case 'ANALYZE':
      console.log(action)
      return []
    default:
      return state
  }
}

export default videos
