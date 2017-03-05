const step = (state = 0, action) => {
  switch (action) {
    case 'SET_STEP':
      return action.step
    default:
      return state
  }
}

export default step
