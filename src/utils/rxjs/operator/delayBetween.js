import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/delay'

function delayBetween(delay, first = false){
  let past = Date.now()

  return this.mergeMap((next, index) => {
    const present = Date.now()
    const futur = Math.max(past + (index === 0 && !first ? 0 : delay), present)
    past = futur
    return Observable.of(next).delay(futur - present)
  })
}

Observable.prototype.delayBetween = delayBetween
