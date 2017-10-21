import { Observable } from 'rxjs/Observable'
import 'utils/rxjs/observable/fromWorker'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/do'
import humanize from 'utils/humanize'

function fromFFMPEG(ffmpeg, job, progress$){
  const worker = new ffmpeg()
  var regexp, duration, current, progress

  return Observable
    .fromWorker(worker)
    .map(msg => {
      switch(msg.type){
        case 'ready':
          worker.postMessage(job)
        break
        case 'stderr':
          if(!progress$){
            return
          }

          regexp = /Duration: ([\.0-9\:]+)/
          if(regexp.test(msg.data)){
            duration = humanize.duration.fromDotFormat(msg.data.match(regexp)[1])
          }

          regexp = /time=([\.0-9\:]+)/
          if(regexp.test(msg.data)){
            current = humanize.duration.fromDotFormat(msg.data.match(regexp)[1])
            progress = Math.floor((current / duration) * 100)
            progress$.next(progress)
          }
        break
        case 'done':
          if(progress < 100){
            progress$.next(100)
          }

          return msg.data
      }

      return null
    })
    .filter(next => next)
    .do(() => worker.terminate())
}

Observable.fromFFMPEG = fromFFMPEG
