import { Observable } from 'rxjs/Observable'
import 'utils/rxjs/observable/fromWorker'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/from'
import 'rxjs/add/observable/empty'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/concatAll'
import humanize from 'utils/humanize'

function fromFFMPEG(ffmpeg, job) {
  const worker = new ffmpeg()
  var duration, progress

  return Observable
    .fromWorker(worker)
    .mergeMap(msg => {
      switch (msg.type) {
        case 'ready':
          worker.postMessage(job)

          return Observable.of({
            type: 'progress',
            data: 0
          })
        break
        case 'stderr':
          const matches = msg.data.match(/Duration: ([\.0-9\:]+)/)
          const time = msg.data.match(/time=([\.0-9\:]+)/)

          if (matches) {
            duration = humanize.duration.fromDotFormat(matches[1])
          }

          if (duration && time) {
            progress = Math.floor((humanize.duration.fromDotFormat(time[1]) / duration) * 100)

            return Observable.of({
              type: 'progress',
              data: progress
            })
          } else {
            return Observable.empty()
          }
        break
        case 'done':
          const after = []

          if (progress < 100) {
            after.unshift({ type: 'progress', data: 100 })
          }

          return Observable
            .of({ type: 'done', data: msg.data })
            .map(msg => progress < 100 ? [{ type: 'progress', data: 100 }, msg] : [msg])
            .concatAll()
        default:
          return Observable.empty()
      }
    })
}

Observable.fromFFMPEG = fromFFMPEG
