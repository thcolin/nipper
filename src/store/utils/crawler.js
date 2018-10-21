import { Subject, merge } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import fromXHR from 'more/rxjs/fromXHR'
import Queue from 'store/utils/queue'

export default new Queue(2)

export function download (url, filename) {
  // hope ajax() progressSubject will support download soon...
  // see rxjs issues #2428 and #2553
  const progress$ = new Subject()
  const download$ = fromXHR('GET', url, Object.assign(new XMLHttpRequest(), {
    responseType: 'arraybuffer',
    onprogress: e => progress$.next({
      type: 'progress',
      data: Math.floor((e.loaded / e.total) * 100)
    })
  }), {
    'access-control-allow-origin': '*'
  }).pipe(
    map(data => {
      progress$.complete()

      return {
        type: 'done',
        data: new File(
          [data.response],
          `${filename}.${data.getResponseHeader('content-type').split('/').pop()}`,
          { type: data.getResponseHeader('content-type') }
        )
      }
    }),
    catchError(error => {
      progress$.complete()
      throw new Error(`Download request failed because of ${error}`) // (string) xhr.statusText
    })
  )

  return merge(progress$, download$)
}
