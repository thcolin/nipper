import { Observable } from 'rxjs/Observable'

function fromHistory(history){
  return Observable.create(subscriber$ => {
    history.listen((location, action) => {
      subscriber$.next({
        action,
        location
      })
    })
  })
}

Observable.fromHistory = fromHistory
