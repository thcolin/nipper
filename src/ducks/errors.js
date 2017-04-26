import { combineEpics } from 'redux-observable'
import React from 'react'

// Actions
const RECEIVE = 'epyd/errors/RECEIVE'
const CLOSE = 'epyd/errors/CLOSE'
const CLEAR = 'epyd/errors/CLEAR'

// Reducer
const initial = {
  /* EXAMPLE :
    1: {
      id: 1,
      children: 'Hello World !'
    }
  */
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case RECEIVE:
      let {type, template, ...error} = action

      if(template === 'YOUTUBE_VIDEO_UNAVAILABLE'){
        error.children = <span>Youtube video <strong>{error.children}</strong> is unavailable</span>
      }

      return {
        ...state,
        [action.id]: {
          ...error,
          closed: false
        }
      }
    case CLOSE:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          closed: true
        }
      }
    case CLEAR:
      return initial
    default:
      return state
  }
}

// Actions Creators
let nextError = 1

export const receiveError = (children, template = null) => ({
  type: RECEIVE,
  id: nextError++,
  children,
  template
})

export const closeError = (id) => ({
  type: CLOSE,
  id
})

export const clearErrors = () => ({
  type: CLEAR
})
