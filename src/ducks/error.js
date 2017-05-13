import React from 'react'

// Actions
export const INCLUDE = 'epyd/errors/error/INCLUDE'
export const CLOSE = 'epyd/errors/error/CLOSE'

// Reducer
const initial = {
  /* EXAMPLE :
    id: 1,
    children: 'Hello World !', // or JSX
    closed: false
  */
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case INCLUDE:
      let {type, template, ...error} = action

      if(template === 'YOUTUBE_VIDEO_UNAVAILABLE'){
        error.children = <span>Youtube video <strong>{error.children}</strong> is unavailable</span>
      }

      return {
        ...error,
        closed: false
      }
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

export const includeError = (children, template = null) => ({
  type: INCLUDE,
  id: nextError++,
  children,
  template
})

export const closeError = (id) => ({
  type: CLOSE,
  id
})
