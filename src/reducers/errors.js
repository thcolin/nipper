const errors = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_ANALYZE':
      return []
    case 'RECEIVE_ERROR':
      let {type, ...error} = action
      return [
        ...state.slice(0, action.id),
        error,
        ...state.slice(action.id)
      ]
    case 'CLOSE_ERROR':
      return state.map(error => {
        if(error.id === action.id){
          error.closed = true
        }

        return error
      })
    default:
      return state
  }
}

export default errors
