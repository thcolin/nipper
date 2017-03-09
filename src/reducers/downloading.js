const downloading = (state = false, action) => {
  console.log('downloading', state, action)
  switch (action.type) {
    case 'SET_DOWNLOADING':
      return action.to
    default:
      return state
  }
}

export default downloading
