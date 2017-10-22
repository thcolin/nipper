import Rx from 'rxjs/Rx'

// Regexps
const YOUTUBE_PLAYLIST_REGEXP = /(youtube\.com\/)(watch|playlist)(.*?list=)([^#\&\?\=]{18,34})/
const YOUTUBE_VIDEO_REGEXP = /(youtu\.?be(\.com)?\/)(watch|embed|v)?(\/|\?)?(.*?v=)?([^#\&\?\=]{11})/

function inspect(url, max = 50, period = 50){
  if(YOUTUBE_PLAYLIST_REGEXP.test(url)){
    return playlist(YOUTUBE_PLAYLIST_REGEXP.exec(url)[4], max, period)
  }

  if(YOUTUBE_VIDEO_REGEXP.test(url)){
    return video(YOUTUBE_VIDEO_REGEXP.exec(url)[6])
  }

  throw new Error('Submited link is **not valid**, you need to provide a **Youtube** video or playlist link')
}

function playlist(id, max, period){
  const items$ = new Rx.Subject()
  let total = 0
  let current = 0

  const token$ = Rx.Observable.of(null)
    .expand(token => Rx.Observable.of(token)
      .mergeMap(token => page(id, max, token))
      .mergeMap(raw => videos(raw.items.map(item => item.snippet.resourceId.videoId))
        .mergeMap(items => {
          Rx.Observable.from(items)
            .do(() => current++)
            .zip(Rx.Observable.timer(0, period), item => item)
            .subscribe(item => items$.next(item), () => {}, () => {
              if (!raw.nextPageToken) {
                for (current; current < total; current++) {
                  items$.next(new Error('Youtube video **undefined** is unavailable'))
                }

                items$.complete()
              }
            })

          if (raw.nextPageToken) {
            return Rx.Observable.of(raw.nextPageToken)
          } else {
            return Rx.Observable.never()
          }
        })
      )
      .delay(Math.max(((max * period) - 200), 2000))
    )

  token$.subscribe()

  const about$ = new Rx.Observable
    .fromPromise(gapi.client.youtube.playlists.list({
      part: 'snippet,contentDetails',
      id
    }))
    .map(response => {
      const body = JSON.parse(response.body)

      if (body.pageInfo.totalResults === 0) {
        items$.complete()
        throw new Error('Youtube playlist **' + id + '** is unavailable')
      }

      total = body.items[0].contentDetails.itemCount

      return body.items[0]
    })

  return {
    about: about$,
    items: items$
  }
}

function video(id){
  const about$ = new Rx.Subject()
  const items$ = videos([id])
    .mergeAll()
    .do(next => {
      about$.next(next.constructor.name === 'Error' ? next : Object.assign({}, {
        kind: next.kind,
        etag: next.etag,
        id: next.id,
        snippet: next.snippet,
        contentDetails: {
          itemCount: 1
        }
      }))
    })
    .filter(next => next.constructor.name !== 'Error')

  return {
    about: about$,
    items: items$
  }
}

function page(id, max, token){
  return Rx.Observable
    .fromPromise(gapi.client.youtube.playlistItems.list({
      playlistId: id,
      part: 'snippet',
      maxResults: max,
      pageToken: token
    }))
    .map(response => JSON.parse(response.body))
    .catch(() => Rx.Observable.never())
}

function videos(ids){
  return Rx.Observable
    .fromPromise(gapi.client.youtube.videos.list({
      id: ids.join(','),
      part: 'id,snippet,contentDetails,statistics'
    }))
    .map(response => {
      const body = JSON.parse(response.body)
      const items = body.items
      const range = items.map(item => item.id)
      const errors = ids
        .filter(id => !range.includes(id))
        .map(id => new Error('Youtube video **' + id + '** is unavailable'))

      return [].concat(items, errors)
    })
}

export default inspect
