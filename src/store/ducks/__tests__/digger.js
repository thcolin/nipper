import { Subject } from 'rxjs'
import * as diggerDuck from 'store/ducks/digger'

jest.setTimeout(300000)

describe('store/ducks/digger', () => {
  it('should return empty jobs on initial state', () => {
    const state = undefined
    const action = {}

    expect(diggerDuck.default(state, action)).toEqual({})
  })

  it('should add dig job', () => {
    const state = undefined
    const action = diggerDuck.doDig('youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF')

    expect(diggerDuck.default(state, action)).toEqual({
      'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
        uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        service: 'youtube',
        kind: 'playlist',
        id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        done: false,
        error: null
      }
    })
  })

  it('should shut dig job', () => {
    const state = {
      'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
        uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        service: 'youtube',
        kind: 'playlist',
        id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        done: false,
        error: null
      },
      'youtube#playlist#PLcyIgDOXdSISycJqTRJowEVc6dv-8DEX5': {
        uri: 'youtube#playlist#PLcyIgDOXdSISycJqTRJowEVc6dv-8DEX5',
        service: 'youtube',
        kind: 'playlist',
        id: 'PLcyIgDOXdSISycJqTRJowEVc6dv-8DEX5',
        done: false,
        error: null
      }
    }

    const action = diggerDuck.shutDig('youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF')

    expect(diggerDuck.default(state, action)).toEqual({
      'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
        uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        service: 'youtube',
        kind: 'playlist',
        id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        done: true,
        error: null
      },
      'youtube#playlist#PLcyIgDOXdSISycJqTRJowEVc6dv-8DEX5': {
        uri: 'youtube#playlist#PLcyIgDOXdSISycJqTRJowEVc6dv-8DEX5',
        service: 'youtube',
        kind: 'playlist',
        id: 'PLcyIgDOXdSISycJqTRJowEVc6dv-8DEX5',
        done: false,
        error: null
      }
    })
  })

  it('should remove dig job', () => {
    const state = {
      'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
        uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        service: 'youtube',
        kind: 'playlist',
        id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        done: false,
        error: null
      }
    }

    const action = diggerDuck.removeDig('PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF')

    expect(diggerDuck.default(state, action)).toEqual({})
  })

  it('should clear digger', () => {
    const state = {
      'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
        uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        service: 'youtube',
        kind: 'playlist',
        id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
        done: false,
        error: null
      }
    }

    const action = diggerDuck.clearDigger()

    expect(diggerDuck.default(state, action)).toEqual({})
  })

  it('should execute dig job when a dig job is added', (done) => {
    const timeline = []
    const action$ = new Subject()
    const action = diggerDuck.doDig('youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF')

    diggerDuck
      .doDigEpic(action$)
      .subscribe(
        (next) => {
          timeline.push(next)

          if (next.type === diggerDuck.SHUT) {
            action$.complete()
          }
        },
        (err) => {
          console.warn(err)
          timeline.push(err)
          action$.complete()
        },
        () => {
          const record = timeline.filter(action => action.type === diggerDuck.RECORD).pop()
          const tracks = timeline.filter(action => action.type === diggerDuck.TRACKS)
          const shut = timeline.filter(action => action.type === diggerDuck.SHUT).pop()

          expect(timeline.length).toEqual(3)
          expect(record).toEqual({
            type: 'nipper/digger/RECORD',
            uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
            record: expect.objectContaining({
              uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
              service: 'youtube',
              kind: 'playlist',
              id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
              title: 'INDIA',
              author: 'Vincent Anthony',
              link: 'https://www.youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
              channel: 'https://www.youtube.com/channel/UC4T79MEKtNfa-PKpgwF0y9g'
            })
          })
          expect(record.record.total).toBeGreaterThanOrEqual(8)
          expect(tracks.length).toBeGreaterThanOrEqual(1)
          expect(tracks[0].tracks.length).toBeGreaterThanOrEqual(8)

          for (let entity of tracks[0].tracks) {
            expect(entity.kind).toEqual(expect.stringMatching(/^(track|error)$/))
          }

          expect(shut).toEqual({
            type: 'nipper/digger/SHUT',
            uri: action.uri,
            error: null
          })
          done()
        }
      )

    action$.next(action)
  })

  it('should shut dig job before its end', (done) => {
    const timeline = []
    const action$ = new Subject()
    const action = diggerDuck.doDig('youtube#playlist#PL4lEESSgxM_5O81EvKCmBIm_JT5Q7JeaI')

    diggerDuck
      .doDigEpic(action$)
      .subscribe(
        (next) => timeline.push(next),
        (err) => {
          console.warn(err)
          timeline.push(err)
          action$.complete()
        },
        () => {
          const record = timeline.filter(action => action.type === diggerDuck.RECORD).pop()
          const tracks = timeline.filter(action => action.type === diggerDuck.TRACKS)
          const errors = timeline.filter(action => action.type === diggerDuck.ERRORS)

          expect(timeline.length).toBeLessThan(20)
          expect(record).toEqual({
            type: 'nipper/digger/RECORD',
            uri: 'youtube#playlist#PL4lEESSgxM_5O81EvKCmBIm_JT5Q7JeaI',
            record: expect.objectContaining({
              uri: 'youtube#playlist#PL4lEESSgxM_5O81EvKCmBIm_JT5Q7JeaI',
              service: 'youtube',
              kind: 'playlist',
              id: 'PL4lEESSgxM_5O81EvKCmBIm_JT5Q7JeaI',
              title: 'The Longest Mixtape - 1000 Songs For You',
              author: 'CaribouVideos',
              link: 'https://www.youtube.com/playlist?list=PL4lEESSgxM_5O81EvKCmBIm_JT5Q7JeaI',
              channel: 'https://www.youtube.com/channel/UCBvCrmhpqZpDdyy4f4uwVXA'
            })
          })
          expect(tracks.length).toBeLessThan(20)
          expect(errors.length).toBeLessThan(20)
          done()
        }
      )

    action$.next(action)

    setTimeout(() => {
      action$.next(diggerDuck.shutDig(action.uri))
      action$.complete()
    }, 10000)
  })
})
