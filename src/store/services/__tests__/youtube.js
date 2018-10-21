import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import youtube from 'store/services/youtube'

jest.setTimeout(300000)

describe('store/services/youtube', () => {
  it('should throw an error when argument is nor a playlist or video link', (done) => {
    let items = []

    youtube('THIS_IS_NOT_A_PLAYLIST_OR_VIDEO_LINK')
      .subscribe(
        (item) => items.push(item),
        (error) => {
          expect(error).toEqual('Provide a **YouTube** video or playlist link')
          expect(items.length).toEqual(0)
          done()
        },
        () => {}
      )
  })

  it('should return youtube#record and youtube#track from a video link', (done) => {
    let items = []

    youtube('youtube.com/watch?v=jVK7PkkdfyQ')
      .subscribe(
        (item) => items.push(item),
        (err) => console.warn(err),
        () => {
          const record = items.filter(item => item.kind === 'record').pop()
          const tracks = items.filter(item => item.kind === 'track')
          const errors = items.filter(item => item.kind === 'error')

          expect(record).toMatchObject({
            uri: 'youtube#record#jVK7PkkdfyQ',
            service: 'youtube',
            kind: 'record',
            id: 'jVK7PkkdfyQ',
            subject: 'track',
            total: 1
          })

          expect(tracks.length).toEqual(1)
          expect(errors.length).toEqual(0)
          expect(tracks.length + errors.length).toEqual(record.total)
          done()
        }
      )
  })

  it('should return multiple youtube#track or youtube#error items when playlist is filled', (done) => {
    let items = []

    youtube('youtube.com/playlist?list=PLWmL9Ldoef0suyCu1PoLR-PEVu9gN4ogR')
      .subscribe(
        (item) => items.push(item),
        (err) => console.warn(err),
        () => {
          const record = items.filter(item => item.kind === 'record').pop()
          const tracks = items.filter(item => item.kind === 'track')
          const errors = items.filter(item => item.kind === 'error')

          expect(record).toMatchObject({
            uri: 'youtube#record#PLWmL9Ldoef0suyCu1PoLR-PEVu9gN4ogR',
            service: 'youtube',
            kind: 'record',
            id: 'PLWmL9Ldoef0suyCu1PoLR-PEVu9gN4ogR',
            subject: 'playlist',
            title: 'Emily is away too',
            author: 'Bazar du Grenier',
            link: 'https://www.youtube.com/playlist?list=PLWmL9Ldoef0suyCu1PoLR-PEVu9gN4ogR',
            channel: 'https://www.youtube.com/channel/UCCMxHHciWRBBouzk-PGzmtQ'
          })

          expect(tracks.length + errors.length).toBeGreaterThanOrEqual(7)
          expect(tracks.length + errors.length).toEqual(record.total)
          done()
        }
      )
  })

  it('should return only youtube#record item when playlist is empty', (done) => {
    let items = []

    youtube('youtube.com/playlist?list=PLFBD601AAB1784335')
      .subscribe(
        (item) => items.push(item),
        (err) => console.warn(err),
        () => {
          const record = items.filter(item => item.kind === 'record').pop()
          const tracks = items.filter(item => item.kind === 'track')
          const errors = items.filter(item => item.kind === 'error')

          expect(record).toMatchObject({
            uri: 'youtube#record#PLFBD601AAB1784335',
            id: 'PLFBD601AAB1784335',
            total: 0
          })

          expect(tracks.length).toEqual(0)
          expect(errors.length).toEqual(0)
          expect(tracks.length + errors.length).toEqual(record.total)
          done()
        }
      )
  })

  it('should fill missing and non-sent youtube#track by youtub#error', (done) => {
    let items = []

    youtube('youtube.com/playlist?list=PL5E26FD021DDB3A96')
      .subscribe(
        (item) => items.push(item),
        (err) => console.warn(err),
        () => {
          const record = items.filter(item => item.kind === 'record').pop()
          const tracks = items.filter(item => item.kind === 'track')
          const errors = items.filter(item => item.kind === 'error')

          expect(record).toMatchObject({
            uri: 'youtube#record#PL5E26FD021DDB3A96',
            id: 'PL5E26FD021DDB3A96'
          })

          expect(errors.length).toBeGreaterThanOrEqual(15)
          expect(tracks.length).toBeLessThanOrEqual(170)
          done()
        }
      )
  })

  it('should return youtube#track from a large playlist in several stages', (done) => {
    let items = []

    youtube('youtube.com/playlist?list=PL4lEESSgxM_5O81EvKCmBIm_JT5Q7JeaI')
      .subscribe(
        (item) => {
          const previous = items.slice(-1).pop()
          const current = { ...item, now: Date.now() }

          if (items.length !== 1 && items.length % 50 === 1) {
            expect(current.now - previous.now).toBeGreaterThanOrEqual(1000)
          }

          items.push(current)
        },
        (err) => console.warn(err),
        () => {
          const record = items.filter(item => item.kind === 'record').pop()
          const tracks = items.filter(item => item.kind === 'track')
          const errors = items.filter(item => item.kind === 'error')

          expect(record).toMatchObject({
            uri: 'youtube#record#PL4lEESSgxM_5O81EvKCmBIm_JT5Q7JeaI',
            id: 'PL4lEESSgxM_5O81EvKCmBIm_JT5Q7JeaI'
          })

          expect(tracks.length + errors.length).toBeGreaterThanOrEqual(900)
          expect(tracks.length + errors.length).toEqual(record.total)
          done()
        }
      )
  })

  it('should abort when asked', (done) => {
    const abort$ = new Subject()
    let items = []

    setTimeout(() => abort$.next(true), 5000)

    youtube('youtube.com/playlist?list=PLeZzFRejLtt9q-ccVcN_j2QntHtbXHfXq', 20)
      .pipe(
        takeUntil(abort$)
      )
      .subscribe(
        (item) => items.push(item),
        (err) => console.warn(err),
        () => {
          const record = items.filter(item => item.kind === 'record').pop()
          const tracks = items.filter(item => item.kind === 'track')
          const errors = items.filter(item => item.kind === 'error')

          expect(record).toMatchObject({
            uri: 'youtube#record#PLeZzFRejLtt9q-ccVcN_j2QntHtbXHfXq',
            id: 'PLeZzFRejLtt9q-ccVcN_j2QntHtbXHfXq'
          })

          expect(tracks.length + errors.length).toBeLessThan(record.total)
          done()
        }
      )
  })
})
