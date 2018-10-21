import * as libraryDuck from 'store/ducks/library'
import * as diggerDuck from 'store/ducks/digger'

describe('store/ducks/library', () => {
  it('should return empty library on initial state', () => {
    const state = undefined
    const action = {}

    expect(libraryDuck.default(state, action)).toEqual({})
  })

  it('should import library', () => {
    const state = undefined
    const action = libraryDuck.importLibrary({
      'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
        uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        source: 'youtube',
        kind: 'playlist',
        id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        title: 'INDIA',
        author: 'Vincent Anthony',
        link: 'https://www.youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        channel: 'https://www.youtube.com/channel/UC4T79MEKtNfa-PKpgwF0y9g',
        description: '',
        total: 8,
        thumbnail: 'https://i.ytimg.com/vi/_IS208pkFxs/hqdefault.jpg',
        synced: 1,
        tracks: ['youtube#track#_IS208pkFxs']
      }
    })

    expect(libraryDuck.default(state, action)).toEqual({
      'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
        uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        source: 'youtube',
        kind: 'playlist',
        id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        title: 'INDIA',
        author: 'Vincent Anthony',
        link: 'https://www.youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        channel: 'https://www.youtube.com/channel/UC4T79MEKtNfa-PKpgwF0y9g',
        description: '',
        total: 8,
        thumbnail: 'https://i.ytimg.com/vi/_IS208pkFxs/hqdefault.jpg',
        synced: 1,
        tracks: ['youtube#track#_IS208pkFxs']
      }
    })
  })

  it('should tape record from digger', () => {
    const state = undefined
    const action = diggerDuck.emitRecord(
      'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
      {
        uri: 'youtube#record#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        source: 'youtube',
        kind: 'record',
        id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        subject: 'playlist',
        title: 'INDIA',
        author: 'Vincent Anthony',
        link: 'https://www.youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        channel: 'https://www.youtube.com/channel/UC4T79MEKtNfa-PKpgwF0y9g',
        description: '',
        total: 8,
        thumbnail: 'https://i.ytimg.com/vi/_IS208pkFxs/hqdefault.jpg'
      }
    )

    expect(libraryDuck.default(state, action)).toMatchObject({
      'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
        uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        source: 'youtube',
        kind: 'playlist',
        id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        title: 'INDIA',
        author: 'Vincent Anthony',
        link: 'https://www.youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        channel: 'https://www.youtube.com/channel/UC4T79MEKtNfa-PKpgwF0y9g',
        description: '',
        total: 8,
        thumbnail: 'https://i.ytimg.com/vi/_IS208pkFxs/hqdefault.jpg',
        synced: 0,
        tracks: []
      }
    })
  })

  it('should amend record tracks', () => {
    const state = {
      'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
        uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        source: 'youtube',
        kind: 'playlist',
        id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        title: 'INDIA',
        author: 'Vincent Anthony',
        link: 'https://www.youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        channel: 'https://www.youtube.com/channel/UC4T79MEKtNfa-PKpgwF0y9g',
        description: '',
        total: 8,
        thumbnail: 'https://i.ytimg.com/vi/_IS208pkFxs/hqdefault.jpg',
        synced: 0,
        tracks: []
      }
    }
    const action = diggerDuck.emitTracks(
      'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
      [
        {
          uri: 'youtube#track#_IS208pkFxs',
          service: 'youtube',
          kind: 'track',
          id: '_IS208pkFxs',
          title: 'Midival Punditz - Raanjhan',
          author: 'inMindbodysoul',
          link: 'https://www.youtube.com/watch?v=_IS208pkFxs',
          channel: 'https://www.youtube.com/channel/UCgEmK9phN-_Ty7d_Jv6BQTg',
          description: '',
          duration: 'PT6M5S',
          thumbnail: 'https://img.youtube.com/vi/_IS208pkFxs/hqdefault.jpg'
        }
      ]
    )

    expect(libraryDuck.default(state, action)).toEqual({
      'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
        uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        source: 'youtube',
        kind: 'playlist',
        id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        title: 'INDIA',
        author: 'Vincent Anthony',
        link: 'https://www.youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        channel: 'https://www.youtube.com/channel/UC4T79MEKtNfa-PKpgwF0y9g',
        description: '',
        total: 8,
        thumbnail: 'https://i.ytimg.com/vi/_IS208pkFxs/hqdefault.jpg',
        synced: 1,
        tracks: ['youtube#track#_IS208pkFxs']
      }
    })
  })

  it('should amend many record tracks', () => {
    const state = {
      'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
        uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        source: 'youtube',
        kind: 'playlist',
        id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        title: 'INDIA',
        author: 'Vincent Anthony',
        link: 'https://www.youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        channel: 'https://www.youtube.com/channel/UC4T79MEKtNfa-PKpgwF0y9g',
        description: '',
        total: 15,
        thumbnail: 'https://i.ytimg.com/vi/_IS208pkFxs/hqdefault.jpg',
        synced: 5,
        tracks: [
          'youtube#track#-1',
          'youtube#track#-2',
          'youtube#track#-3',
          'youtube#track#-4',
          'youtube#track#-5',

          'youtube#track#6',
          'youtube#error#7',
          'youtube#track#8',
          'youtube#error#9',
          'youtube#track#10',

          'youtube#track#11',
          'youtube#track#12',
          'youtube#track#13',
          'youtube#track#14',
          'youtube#track#15'
        ]
      }
    }
    const action = diggerDuck.emitTracks(
      'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
      [
        { uri: 'youtube#track#-6' },
        { uri: 'youtube#track#-7' },
        { uri: 'youtube#track#-8' },
        { uri: 'youtube#track#-9' },
        { uri: 'youtube#track#-10' }
      ]
    )

    expect(libraryDuck.default(state, action)).toEqual({
      'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
        uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        source: 'youtube',
        kind: 'playlist',
        id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        title: 'INDIA',
        author: 'Vincent Anthony',
        link: 'https://www.youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        channel: 'https://www.youtube.com/channel/UC4T79MEKtNfa-PKpgwF0y9g',
        description: '',
        total: 15,
        thumbnail: 'https://i.ytimg.com/vi/_IS208pkFxs/hqdefault.jpg',
        synced: 10,
        tracks: [
          'youtube#track#-1',
          'youtube#track#-2',
          'youtube#track#-3',
          'youtube#track#-4',
          'youtube#track#-5',

          'youtube#track#-6',
          'youtube#track#-7',
          'youtube#track#-8',
          'youtube#track#-9',
          'youtube#track#-10',

          'youtube#track#11',
          'youtube#track#12',
          'youtube#track#13',
          'youtube#track#14',
          'youtube#track#15'
        ]
      }
    })
  })
})
