import marksy from 'marksy'
import uuidv4 from 'uuid/v4'
import config from 'utils/marksy'

const markdownize = marksy(config)

// Actions
export const INCLUDE = 'victrola/errors/error/INCLUDE'
export const CLOSE = 'victrola/errors/error/CLOSE'

// Reducer
const initial = {
  /* EXAMPLE :
    uuid: '30fff21e-469a-437c-8cd4-483a9348ad15',
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
export const includeError = (origin, children, markdown = false) => ({
  type: INCLUDE,
  uuid: uuidv4(),
  origin,
  closed: false,
  children: markdown ? markdownize(children.toString()).tree : children
})

export const closeError = (uuid) => ({
  type: CLOSE,
  uuid
})
