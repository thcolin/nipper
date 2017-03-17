const initial = {
  id: null,
  kind: null,
  pause: false,
  total: null,
  token: null
}

const analyze = (state = initial, action) => {
  switch (action.type) {
    case 'ANALYZE':
      return Object.assign({}, state, {
        id: action.id,
        kind: action.kind,
        total: 1
      })
    case 'TOGGLE_PAUSE':
      return Object.assign({}, state, {
        pause: !state.pause
      })
    default:
      return state
  }
}

export default analyze
