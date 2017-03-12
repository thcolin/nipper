const job = (state = {loading: true}, action) => {
  console.log('job', state, action)
  switch (action.type) {
    case 'TOGGLE_LOADING':
      return Object.assign({}, state, {
        loading: !state.loading
      })
    default:
      return state
  }
}

export default job
