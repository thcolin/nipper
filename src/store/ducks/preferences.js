import formats from 'store/formats'

// Actions
export const SET = 'nipper/preferences/SET'
export const CLEAR = 'nipper/preferences/CLEAR'

// Reducer
const initial = {
  format: Object.keys(formats).shift()
}

export default function reducer (state = initial, action = {}) {
  switch (action.type) {
    case SET:
      return {
        ...state,
        [action.key]: action.value
      }
    case CLEAR:
      return {
        ...initial
      }
    default:
      return state
  }
}

// Actions creators
export const setPreference = (key, value) => ({
  type: SET,
  key,
  value
})

export const clearPreferences = () => ({
  type: CLEAR
})
