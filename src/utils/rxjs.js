import Rx from 'rxjs/Rx'
import moment from 'moment' // for rxjs.fromFFMPEG

function retryWithDelay(retry, delay, cb){
  return this.retryWhen(errors => errors.scan((count, error) => {
    if(typeof cb === 'function'){
      cb(count)
    }
    if(count >= retry){
      throw error
    }

    return count + 1
  }, 0).delay(delay))
}

Rx.Observable.prototype.retryWithDelay = retryWithDelay

function fromFileReader(file){
  return Rx.Observable.create(subscriber$ => {
    const reader = new FileReader()

    reader.onload = (e) => {
      subscriber$.next(e.target.result)
      subscriber$.complete()
    }

    reader.readAsArrayBuffer(file)
  })
}

Rx.Observable.fromFileReader = fromFileReader

function fromWorker(worker){
  return Rx.Observable.create(subscriber$ => {
    worker.onmessage = e => {
      subscriber$.next(e.data)

      if(e.data.type === 'done'){
        subscriber$.complete()
      }
    }

    worker.onerror = err => subscriber$.error(err)
  })
}

Rx.Observable.fromWorker = fromWorker

function fromXHR(method, url, xhr = null){
  return Rx.Observable.create(subscriber$ => {
    xhr = xhr ? xhr : new XMLHttpRequest()
    const onload = xhr.onload
    const onerror = xhr.onerror

    xhr.open(method, url, true)

    xhr.onload = e => {
      if(onload){
        onload(e)
      }

      if(xhr.status === 200){
        subscriber$.next(xhr)
        subscriber$.complete()
      } else {
        subscriber$.error('[' + xhr.status + '] ' + xhr.statusText)
      }
    }

    xhr.onerror = e => {
      if(onerror){
        onerror(e)
      }

      subscriber$.error(new Error('Unknown Error'))
    }

    xhr.send()
  })
}

Rx.Observable.fromXHR = fromXHR

function fromHistory(history){
  return Rx.Observable.create(subscriber$ => {
    history.listen((location, action) => {
      subscriber$.next({
        action,
        location
      })
    })
  })
}

Rx.Observable.fromHistory = fromHistory

function fromFFMPEG(ffmpeg, job, progress$){
  const worker = new ffmpeg()
  var regexp, duration, current

  return Rx.Observable
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
            duration = moment.duration(msg.data.match(regexp)[1]).asMilliseconds()
          }

          regexp = /time=([\.0-9\:]+)/
          if(regexp.test(msg.data)){
            current = moment.duration(msg.data.match(regexp)[1]).asMilliseconds()
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

Rx.Observable.fromFFMPEG = fromFFMPEG

export default Rx
