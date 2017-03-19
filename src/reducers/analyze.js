const initial = {
  id: null,
  kind: null,
  ready: false,
  pause: false,
  total: null,
  token: null
}

const analyze = (state = initial, action) => {
  switch (action.type) {
    case 'RECEIVE_ANALYZE':
      let {type, ...analyze} = action
      return Object.assign({}, state, analyze)
    case 'TOGGLE_PAUSE':
      return Object.assign({}, state, {
        pause: !state.pause
      })
    default:
      return state
  }
}

export default analyze
