import 'rxjs'
import Rx from 'rxjs/Rx'

function pausableBuffered(pauser$) {
  return Rx.Observable.create(subscriber$ => {
    var source$ = this
    var buffer$ = new Rx.Subject()
    var flusher$ = new Rx.Subject()

    var paused = false

    // every flusher$ ping, send bufferized data to subscriber$
    buffer$
      .buffer(flusher$)
      .concatAll()
      .subscribe(v => subscriber$.next(v))

    pauser$.subscribe(to => {
      paused = to

      if(!paused){
        // flush buffer$ when RESUME
        flusher$.next(true)
      }
    })

    source$.subscribe(
      // if paused, send data to buffer$ waiting to be flushed, else send data directly to subscriber$
      v => paused ? buffer$.next(v) : subscriber$.next(v),
      e => subscriber$.error(e),
      () => {
        // flush buffer$ when source$ is completed
        flusher$.next(true)
        subscriber$.complete()
      }
    )
  })
}

Rx.Observable.prototype.pausableBuffered = pausableBuffered

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
        subscriber$.error(xhr.statusText)
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

export default Rx
