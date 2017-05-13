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

export const includeError = (children, template = null) => {
  switch(template){
    case 'YOUTUBE_VIDEO_UNAVAILABLE':
      children = <span>Youtube video <strong>{children}</strong> is unavailable</span>
    break
  }

  return {
    type: INCLUDE,
    id: nextError++,
    closed: false,
    children
  }
}

export const closeError = (id) => ({
  type: CLOSE,
  id
})
