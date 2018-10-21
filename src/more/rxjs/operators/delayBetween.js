import { of } from 'rxjs'
import { mergeMap, delay } from 'rxjs/operators'

const delayBetween = (time, first = false) => (source) => {
  let past = Date.now()

  return source.pipe(
    mergeMap((next, index) => {
      const present = Date.now()
      const futur = Math.max(past + (index === 0 && !first ? 0 : time), present)
      past = futur
      return of(next).pipe(delay(futur - present))
    })
  )
}

export default delayBetween
