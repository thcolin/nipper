import * as errorDuck from 'ducks/error'

// Actions
const INCLUDE = 'victrola/errors/INCLUDE'
const CLEAR = 'victrola/errors/CLEAR'

// Reducer
const initial = {
  entities: {
    /* EXAMPLE :
      '30fff21e-469a-437c-8cd4-483a9348ad15': [object Error],
      '5d50021a-b823-414c-83fe-37138c03af5f': [object Error]
    */
  },
  result: [
    /* EXAMPLE :
      '30fff21e-469a-437c-8cd4-483a9348ad15', '5d50021a-b823-414c-83fe-37138c03af5f'
    */
  ]
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case INCLUDE:
      return {
        entities: Object.assign({}, state.entities, action.errors
          .reduce((accumulator, current) => Object.assign(accumulator, { [current.uuid]: current }), {})
        ),
        result: state.result.concat(action.errors.map(error => error.uuid))
      }
    case CLEAR:
      return initial
    case errorDuck.INCLUDE:
    case errorDuck.CLOSE:
      return {
        entities: {
          ...state.entities,
          [action.uuid]: errorDuck.default(state.entities[action.uuid] || {}, action)
        },
        result: (state.result.includes(action.uuid) ? state.result : state.result.concat(action.uuid))
      }
    default:
      return state
  }
}

// Actions Creators
export const includeErrors = (origin, childrens, markdown = false) => ({
  type: INCLUDE,
  errors: childrens.map(children => {
    const action = errorDuck.includeError(origin, children, markdown)
    let {type, ...error} = action
    return error
  })
})

export const clearErrors = () => ({
  type: CLEAR
})
