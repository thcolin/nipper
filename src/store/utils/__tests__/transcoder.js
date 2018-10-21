import p from 'path'
import fs from 'fs'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { extract, convert, labelize } from 'store/utils/transcoder'
import CODECS from 'store/codecs'

const fixtures = {
  mp4: fs.readFileSync(p.resolve(__dirname, 'fixtures', 'transcoder-video.mp4')),
  webm: fs.readFileSync(p.resolve(__dirname, 'fixtures', 'transcoder-audio.webm')),
  mp3: fs.readFileSync(p.resolve(__dirname, 'fixtures', 'transcoder-audio.mp3')),
  jpg: fs.readFileSync(p.resolve(__dirname, 'fixtures', 'transcoder-cover.jpg'))
}

jest.mock('ffmpeg.js/ffmpeg-worker-youtube.js', () => {
  return function () {
    this.onmessage = () => {}
    this.onerror = () => {}
    this.terminate = () => this.queue.forEach(timeout => clearTimeout(timeout))
    this.postMessage = (event) => {
      this.queue = [
        setTimeout(() => this.onmessage({
          data: {
            type: 'stderr',
            data: '  Duration: 00:02:37.21, start: 0.000000, bitrate: 114 kb/s'
          }
        }), 2000),
        setTimeout(() => this.onmessage({
          data: {
            type: 'stderr',
            data: 'size=     831kB time=00:00:46.33 bitrate= 146.9kbits/s'
          }
        }), 3000),
        setTimeout(() => this.onmessage({
          data: {
            type: 'stderr',
            data: 'size=    1725kB time=00:01:36.79 bitrate= 146.0kbits/s'
          }
        }), 4000),
        setTimeout(() => this.onmessage({
          data: {
            type: 'stderr',
            data: 'size=    2837kB time=00:02:37.21 bitrate= 147.8kbits/s'
          }
        }), 5000),
        setTimeout(() => this.onmessage({
          data: {
            type: 'done',
            data: {
              MEMFS: [{
                data: 'Hello World !'
              }]
            }
          }
        }), 6000)
      ]
    }

    setTimeout(() => this.onmessage({
      data: {
        type: 'ready'
      }
    }), 1000)
  }
})

jest.setTimeout(300000)

describe('store/utils/transcoder.extract', () => {
  it('should dispatch progress and done events', (done) => {
    const fixture = new File([fixtures.mp4], 'R4F_MxCEh_s.mp4', { type: 'audio/mp4' })
    let messages = []

    extract(fixture, CODECS.aac)
      .subscribe(
        (message) => messages.push(message),
        (e) => console.warn(e),
        () => {
          expect(messages.filter(message => message.type === 'progress').length).toBeGreaterThanOrEqual(1)
          expect(messages.filter(message => message.type === 'done').length).toEqual(1)
          expect(messages.filter(message => message.type === 'done').pop().data.name).toEqual('R4F_MxCEh_s.m4a')
          expect(messages.filter(message => message.type === 'done').pop().data.type).toEqual('audio/aac')
          done()
        }
      )
  })

  it('should abort when asked', (done) => {
    const abort$ = new Subject()
    const fixture = new File([fixtures.mp4], 'R4F_MxCEh_s.mp4', { type: 'video/mp4' })
    let messages = []

    setTimeout(() => abort$.next(true), 5000)

    extract(fixture, CODECS.aac)
      .pipe(
        takeUntil(abort$)
      )
      .subscribe(
        (message) => messages.push(message),
        (e) => console.warn(e),
        () => {
          expect(messages.filter(message => message.type === 'progress').length).toBeGreaterThanOrEqual(1)
          expect(messages.filter(message => message.type === 'done').length).toEqual(0)
          done()
        }
      )
  })
})

describe('store/utils/transcoder.convert', () => {
  it('should dispatch progress and done events', (done) => {
    const fixture = new File([fixtures.webm], 'R4F_MxCEh_s.webm', { type: 'video/opus' })
    let messages = []

    convert(fixture, CODECS.mp3)
      .subscribe(
        (message) => messages.push(message),
        (e) => console.warn(e),
        () => {
          expect(messages.filter(message => message.type === 'progress').length).toBeGreaterThanOrEqual(1)
          expect(messages.filter(message => message.type === 'done').length).toEqual(1)
          expect(messages.filter(message => message.type === 'done').pop().data.name).toEqual('R4F_MxCEh_s.mp3')
          expect(messages.filter(message => message.type === 'done').pop().data.type).toEqual('audio/mp3')
          done()
        }
      )
  })

  it('should abort when asked', (done) => {
    const abort$ = new Subject()
    const fixture = new File([fixtures.webm], 'R4F_MxCEh_s.webm', { type: 'audio/opus' })
    let messages = []

    setTimeout(() => abort$.next(true), 5000)

    convert(fixture, CODECS.mp3)
      .pipe(
        takeUntil(abort$)
      )
      .subscribe(
        (message) => messages.push(message),
        (e) => console.warn(e),
        () => {
          expect(messages.filter(message => message.type === 'progress').length).toBeGreaterThanOrEqual(1)
          expect(messages.filter(message => message.type === 'done').length).toEqual(0)
          done()
        }
      )
  })
})

describe('store/utils/transcoder.labelize', () => {
  it('should dispatch progress and done events', (done) => {
    const fixture = new File([fixtures.mp3], 'R4F_MxCEh_s.mp3', { type: 'audio/mp3' })
    let messages = []

    labelize(fixture, { song: 'Bienvenidx', artist: 'SiempreViva', cover: new Blob([fixtures.jpg]) })
      .subscribe(
        (message) => messages.push(message),
        (e) => console.warn(e),
        () => {
          expect(messages.filter(message => message.type === 'progress').length).toBeGreaterThanOrEqual(1)
          expect(messages.filter(message => message.type === 'done').length).toEqual(1)
          done()
        }
      )
  })

  it('should abort when asked', (done) => {
    const abort$ = new Subject()
    const fixture = new File([fixtures.webm], 'R4F_MxCEh_s.webm', { type: 'audio/opus' })
    let messages = []

    setTimeout(() => abort$.next(true), 5000)

    labelize(fixture, { song: 'Bienvenidx', artist: 'SiempreViva', cover: new Blob([fixtures.jpg]) })
      .pipe(
        takeUntil(abort$)
      )
      .subscribe(
        (message) => messages.push(message),
        (e) => console.warn(e),
        () => {
          expect(messages.filter(message => message.type === 'progress').length).toBeGreaterThanOrEqual(1)
          expect(messages.filter(message => message.type === 'done').length).toEqual(0)
          done()
        }
      )
  })
})
