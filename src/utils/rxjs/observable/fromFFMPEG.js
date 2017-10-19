import { Observable } from 'rxjs/Observable'
import 'utils/rxjs/observable/fromWorker'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/do'
import humanize from 'utils/humanize'

function fromFFMPEG(ffmpeg, job, progress$){
  const worker = new ffmpeg()
  var regexp, duration, current

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
            progress$.next(Math.floor((current / duration) * 100))
          }
        break
        case 'done':
          return msg.data
      }

      return null
    })
    .filter(next => next)
    .do(() => worker.terminate())
}

Observable.fromFFMPEG = fromFFMPEG
