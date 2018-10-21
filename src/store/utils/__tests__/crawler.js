import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { download } from 'store/utils/crawler'
import mock from 'xhr-mock'

describe('store/utils/crawler.download', () => {
  beforeEach(() => mock.setup())
  afterEach(() => mock.teardown())

  it('should dispatch progress and done events', (done) => {
    let messages = []

    mock.get('http://www.ovh.net/files/100Mio.dat', async (req, res) => {
      return res
        .headers({
          'Content-Length': '65536',
          'content-type': 'application/octet-stream'
        })
        .body(Array(65536).fill('0').join(''))
        .status(200)
    })

    download('http://www.ovh.net/files/100Mio.dat', '100Mio.dat')
      .subscribe(
        (message) => messages.push(message),
        (e) => console.warn(e),
        () => {
          expect(messages.filter(message => message.type === 'progress').length).toBeGreaterThanOrEqual(1)
          expect(messages.filter(message => message.type === 'done').length).toEqual(1)
          done()
        }
      )
  })

  it('should abort when asked', (done) => {
    const abort$ = new Subject()
    let messages = []

    mock.get('http://www.ovh.net/files/100Mio.dat', async (req, res) => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return res
        .headers({
          'Content-Length': '65536',
          'content-type': 'application/octet-stream'
        })
        .body(Array(65536).fill('0').join(''))
        .status(200)
    })

    setTimeout(() => abort$.next(true), 1000)

    download('http://www.ovh.net/files/100Mio.dat', '100Mio.dat')
      .pipe(
        takeUntil(abort$)
      )
      .subscribe(
        (message) => messages.push(message),
        (e) => console.warn(e),
        () => {
          const progress = messages.filter(message => message.type === 'progress')
          const final = messages.filter(message => message.type === 'done')

          expect(progress.length).toBeGreaterThanOrEqual(0)
          expect(final.length).toEqual(0)
          done()
        }
      )
  })
})
