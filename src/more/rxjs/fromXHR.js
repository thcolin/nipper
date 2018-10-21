import { Observable } from 'rxjs'

export default function fromXHR (method, url, xhr = null, headers = {}) {
  return Observable.create(subscriber$ => {
    xhr = xhr || new XMLHttpRequest()
    const { onload, onerror } = xhr

    xhr.open(method, url, true)

    for (let header in headers) {
      xhr.setRequestHeader(header, headers[header])
    }

    xhr.onload = e => {
      if (onload) {
        onload(e)
      }

      if (xhr.status === 200) {
        subscriber$.next(xhr)
        subscriber$.complete()
      } else {
        subscriber$.error(`[${xhr.status}] ${xhr.statusText}`)
      }
    }

    xhr.onerror = e => {
      if (onerror) {
        onerror(e)
      }

      subscriber$.error(e)
    }

    xhr.send()

    return () => xhr.abort()
  })
}
