import marksy from 'marksy'
import config from 'utils/marksy'

const markdownize = marksy(config)

// Actions
export const INCLUDE = 'epyd/errors/error/INCLUDE'
export const CLOSE = 'epyd/errors/error/CLOSE'

// Reducer
const initial = {
  /* EXAMPLE :
    id: 1,
    origin: 'state',
    children: 'Hello World !', // or JSX
    closed: false
  */
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case INCLUDE:
      let {type, ...error} = action
      return error
    case CLOSE:
      return {
        ...state,
        closed: true
      }
    default:
      return state
  }
}

// Actions Creators
let nextError = 1

export const includeError = (origin, children, markdown = false) => ({
  type: INCLUDE,
  id: nextError++,
  origin,
  closed: false,
  children: markdown ? markdownize(children).tree : children
})

export const closeError = (id) => ({
  type: CLOSE,
  id
})
