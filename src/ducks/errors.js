import * as errorDuck from 'ducks/error'

// Actions
const CLEAR = 'epyd/errors/CLEAR'

// Reducer
const initial = {
  entities: {
    /* EXAMPLE :
      1: [object Error],
      2: [object Error]
    */
  },
  result: [
    /* EXAMPLE :
      1, 2
    */
  ]
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case CLEAR:
      return initial
    case errorDuck.INCLUDE:
    case errorDuck.CLOSE:
      return {
        entities: {
          ...state.entities,
          [action.id]: errorDuck.default(state.entities[action.id] || {}, action)
        },
        result: (state.result.includes(action.id) ? state.result : state.result.concat(action.id))
      }
    default:
      return state
  }
}

// Actions Creators
export const clearErrors = () => ({
  type: CLEAR
})
