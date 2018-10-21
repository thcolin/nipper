import * as diggerDuck from 'store/ducks/digger'

// Actions
export const IMPORT = 'nipper/library/IMPORT'
export const DUMP = 'nipper/library/DUMP'
export const REMOVE = 'nipper/library/REMOVE'
export const CLEAR = 'nipper/library/CLEAR'

// Reducer
const initial = {
  // 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
  //   uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
  //   source: 'youtube',
  //   kind: 'playlist',
  //   id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
  //   title: 'INDIA',
  //   author: 'Vincent Anthony',
  //   link: 'https://www.youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
  //   channel: 'https://www.youtube.com/channel/UC4T79MEKtNfa-PKpgwF0y9g',
  //   description: '',
  //   total: 8,
  //   thumbnail: 'https://i.ytimg.com/vi/_IS208pkFxs/hqdefault.jpg',
  //   synced: 1,
  //   tracks: ['youtube#track#_IS208pkFxs'],
  //   latest: 1538421904852,
  // },
}

export default function reducer (state = initial, action = {}) {
  switch (action.type) {
    case IMPORT:
      return {
        ...action.library
      }
    case diggerDuck.RECORD:
      return {
        ...state,
        [action.uri]: {
          ...action.record,
          synced: 0,
          tracks: state[action.uri] ? state[action.uri].tracks : [],
          latest: Date.now()
        }
      }
    case diggerDuck.TRACKS:
    case diggerDuck.ERRORS:
      return {
        ...state,
        [action.uri]: {
          ...state[action.uri],
          synced: state[action.uri].synced + (action.tracks || action.errors).length,
          tracks: [
            ...state[action.uri].tracks.slice(0, state[action.uri].synced),
            ...(action.tracks || action.errors)
              .map(item => state[action.uri].tracks.includes(item.uri.replace(/error/, 'track')) ? item.uri.replace(/error/, 'track') : item.uri),
            ...state[action.uri].tracks.slice(
              state[action.uri].synced + (action.tracks || action.errors).length,
              state[action.uri].total
            )
          ]
        }
      }
    case REMOVE:
      return Object.values(state)
        .filter(record => record.uri !== action.uri)
        .reduce((records, record) => ({ ...records, [record.uri]: record }), {})
    case CLEAR:
      return {
        ...initial
      }
    default:
      return state
  }
}

// Actions Creators
export const importLibrary = (library) => ({
  type: IMPORT,
  library
})

export const dumpLibrary = () => ({
  type: DUMP
})

export const removeLibrary = (uri) => ({
  type: REMOVE,
  uri
})

export const clearLibrary = () => ({
  type: CLEAR
})
