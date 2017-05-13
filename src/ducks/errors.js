import * as errorDuck from 'ducks/error'

// Actions
const CLEAR = 'epyd/errors/CLEAR'

// Reducer
const initial = {
  /* EXAMPLE :
    1: [object Error],
    2: [object Error]
  */
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case CLEAR:
      return initial
    case errorDuck.INCLUDE:
    case errorDuck.CLOSE:
      return {
        ...state,
        [action.id]: errorDuck.default(state[action.id] || {}, action)
      }
    default:
      return state
  }
}

// Actions Creators
export const clearErrors = () => ({
  type: CLEAR
})
