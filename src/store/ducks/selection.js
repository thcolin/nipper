// Actions
export const INSERT = 'nipper/selection/INSERT'
export const REMOVE = 'nipper/selection/REMOVE'
export const CLEAR = 'nipper/selection/CLEAR'

// Reducer
const initial = []

export default function reducer (state = initial, action = {}) {
  switch (action.type) {
    case INSERT:
      return [...new Set([...state].concat(action.tracks))]
    case REMOVE:
      return state.filter(uri => !action.tracks.includes(uri))
    case CLEAR:
      return initial
    default:
      return state
  }
}

// Actions creators
export const insertSelection = (tracks) => ({
  type: INSERT,
  tracks: Array.isArray(tracks) ? tracks : [tracks]
})

export const removeSelection = (tracks) => ({
  type: REMOVE,
  tracks: Array.isArray(tracks) ? tracks : [tracks]
})

export const clearSelection = () => ({
  type: CLEAR
})
