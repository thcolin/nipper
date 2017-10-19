import { Observable } from 'rxjs/Observable'

function fromXHR(method, url, xhr = null){
  return Observable.create(subscriber$ => {
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

Observable.fromXHR = fromXHR
