import { of, from, EMPTY } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import fromWorker from 'more/rxjs/fromWorker'
import FFMPEG from 'ffmpeg.js/ffmpeg-worker-youtube.js'

const parseDotDuration = (source) => {
  const time = source.split(':')

  return Array(3 - time.length).fill('00').concat(time)
    .map((t, i) => [3600000, 60000, 1000][i] * t)
    .reduce((a, t) => a + t, 0)
}

export default function fromFFMPEG (job) {
  const worker = new FFMPEG()
  let duration, progress

  return fromWorker(worker).pipe(
    mergeMap(message => {
      switch (message.type) {
        case 'ready':
          worker.postMessage(job)

          return of({
            type: 'progress',
            data: 0
          })
        case 'stderr':
          const matches = message.data.match(/Duration: ([.0-9:]+)/)
          const time = message.data.match(/time=([.0-9:]+)/)

          if (matches) {
            duration = parseDotDuration(matches[1])
          }

          if (duration && time) {
            progress = Math.floor((parseDotDuration(time[1]) / duration) * 100)

            return of({
              type: 'progress',
              data: progress
            })
          } else {
            return EMPTY
          }
        case 'done':
          return from(progress < 100 ? [{ type: 'progress', data: 100 }, message] : [message])
        default:
          return EMPTY
      }
    })
  )
}
