import { Observable } from 'rxjs'

export default function fromWorker (worker) {
  return Observable.create(observer => {
    worker.onmessage = e => {
      observer.next(e.data)

      if (e.data.type === 'done') {
        observer.complete()
        worker.terminate()
      }
    }

    worker.onerror = err => {
      observer.error(err)
      worker.terminate()
    }

    return () => worker.terminate()
  })
}
