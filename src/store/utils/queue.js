import { Observable, Subject, EMPTY } from 'rxjs'
import { filter, mergeMap, catchError, takeUntil, tap } from 'rxjs/operators'
import delayBetween from 'more/rxjs/operators/delayBetween'

export default class Queue {
  constructor (limit) {
    this.queue = new Subject()
    this.queue.pipe(
      delayBetween(2000),
      filter(({ unsubscribe }) => !unsubscribe.isStopped),
      mergeMap(({ job }) => job, null, limit)
    ).subscribe()
  }

  schedule (job) {
    return Observable.create(observer => {
      const unsubscribe = new Subject()

      this.queue.next({
        unsubscribe,
        job: job.pipe(
          tap(
            value => observer.next(value),
            error => observer.error(error),
            () => observer.complete()
          ),
          catchError(() => EMPTY),
          takeUntil(unsubscribe)
        )
      })

      return () => unsubscribe.next(true) || unsubscribe.complete()
    })
  }
}
