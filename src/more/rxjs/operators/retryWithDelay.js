import { retryWhen, scan, delay } from 'rxjs/operators'

const retryWithDelay = (retry, time, cb) => retryWhen(errors => errors.pipe(
  scan((count, error) => {
    if (typeof cb === 'function') {
      cb(count)
    }

    if (count >= retry) {
      throw error
    }

    return count + 1
  }, 0),
  delay(time)
))

export default retryWithDelay
