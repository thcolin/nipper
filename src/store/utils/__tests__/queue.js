import { Subject, of, merge, timer, throwError } from 'rxjs'
import { delay, takeUntil, take, last, finalize } from 'rxjs/operators'
import Queue from 'store/utils/queue'

jest.setTimeout(300000)

describe('store/utils/queue', () => {
  const queue = new Queue(2)
  const work = (handicap) => merge(
    of('progress'),
    of('progress').pipe(delay(handicap + 1000)),
    of('progress').pipe(delay(handicap + 2000)),
    of('progress').pipe(delay(handicap + 3000)),
    of('progress').pipe(delay(handicap + 4000)),
    of('done').pipe(delay(handicap + 5000))
  )

  it('should handle ony 2 jobs synchronously', (done) => {
    const done$ = new Subject()
    const jobs = {
      a: {
        value: null,
        $: queue.schedule(work(Math.random() * 1000))
      },
      b: {
        value: null,
        $: queue.schedule(work(Math.random() * 1000))
      },
      c: {
        value: null,
        $: queue.schedule(work(Math.random() * 1000))
      },
      d: {
        value: null,
        $: queue.schedule(work(Math.random() * 1000))
      }
    }

    for (let key in jobs) {
      jobs[key].$.subscribe(
        message => {
          jobs[key].value = message
          expect(Object.values(jobs).filter(obj => obj.value === 'progress').length).toBeLessThanOrEqual(2)
        },
        error => console.warn(error),
        () => done$.next(key)
      )
    }

    done$.pipe(
      take(Object.keys(jobs).length),
      last()
    ).subscribe(
      () => done()
    )
  })

  it('should abort when asked', (done) => {
    const jobs = {
      a: {
        value: null,
        $: queue.schedule(work(Math.random() * 1000).pipe(
          finalize(() => {
            expect(jobs.a.value).toEqual('progress')
            jobs.a.value = 'ABORTED'
            done()
          })
        ))
      }
    }

    jobs.a.$.pipe(
      takeUntil(timer(3000))
    ).subscribe(
      message => jobs.a.value = message, // eslint-disable-line no-return-assign
      error => console.warn(error)
    )
  })

  it('should handle next queued job when ongoing is aborted', (done) => {
    const done$ = new Subject()
    const jobs = {
      a: {
        value: null,
        $: queue.schedule(work(Math.random() * 1000))
      },
      b: {
        value: null,
        $: queue.schedule(work(Math.random() * 1000).pipe(
          finalize(() => {
            jobs.b.value = 'ABORTED'
            expect(Object.values(jobs).filter(obj => obj.value === 'progress').length).toEqual(2)
          })
        )).pipe(
          takeUntil(timer(2000))
        )
      },
      c: {
        value: null,
        $: queue.schedule(work(Math.random() * 1000))
      },
      d: {
        value: null,
        $: queue.schedule(work(Math.random() * 1000))
      }
    }

    for (let key in jobs) {
      jobs[key].$.subscribe(
        message => jobs[key].value = message, // eslint-disable-line no-return-assign
        error => console.warn(error),
        () => done$.next(key)
      )
    }

    done$.pipe(
      take(Object.keys(jobs).length),
      last()
    ).subscribe(
      () => done()
    )
  })

  it('should handle next queued job when ongoing throw an error', (done) => {
    const done$ = new Subject()
    const jobs = {
      a: {
        value: null,
        $: queue.schedule(work(Math.random() * 1000))
      },
      b: {
        value: null,
        $: merge(
          queue.schedule(work(Math.random() * 1000)),
          throwError('b').pipe(
            delay(3000)
          )
        )
      },
      c: {
        value: null,
        $: queue.schedule(work(Math.random() * 1000))
      },
      d: {
        value: null,
        $: queue.schedule(work(Math.random() * 1000))
      }
    }

    for (let key in jobs) {
      jobs[key].$.subscribe(
        message => jobs[key].value = message, // eslint-disable-line no-return-assign
        error => {
          console.warn(error)
          jobs[key].value = 'error'
        },
        () => done$.next(key)
      )
    }

    done$.pipe(
      take(Object.keys(jobs).length - 1),
      last()
    ).subscribe(
      () => {
        expect(Object.values(jobs).filter(obj => obj.value === 'done').length).toEqual(3)
        expect(Object.values(jobs).filter(obj => obj.value === 'error').length).toEqual(1)
        done()
      }
    )
  })
})
