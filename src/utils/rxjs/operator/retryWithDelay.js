import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/retryWhen'
import 'rxjs/add/operator/scan'
import 'rxjs/add/operator/delay'

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

Observable.prototype.retryWithDelay = retryWithDelay
