import { Observable } from 'rxjs/Observable'

function fromWorker(worker){
  return Observable.create(subscriber$ => {
    worker.onmessage = e => {
      subscriber$.next(e.data)

      if(e.data.type === 'done'){
        subscriber$.complete()
      }
    }

    worker.onerror = err => subscriber$.error(err)
  })
}

Observable.fromWorker = fromWorker
