import Rx from 'rxjs/Rx'

class yapi{
  playlist(id, interval = 1000, max = 50){
    const playlist$ = new Rx.Subject()
    const flusher$ = new Rx.Subject().filter(next => next)
    var count = 0

    setTimeout(() => {
      playlist$.next(undefined)
      flusher$.next(true)
    })

    const about$ = new Rx.Observable
      .fromPromise(gapi.client.youtube.playlists
        .list({
          part: 'snippet,contentDetails',
          id
        })
      )
      .map(response => JSON.parse(response.body))
      .catch(() => {
        throw new Error('Youtube playlist **' + id + '** is unavailable')
      })

    const items$ = playlist$
      .buffer(flusher$) // ask for a confirm
      .concatAll()
      .takeWhile(token => token !== null)
      .switchMap(token => Rx.Observable
        .fromPromise(gapi.client.youtube.playlistItems
          .list({
            playlistId: id,
            part: 'snippet',
            maxResults: max,
            pageToken: token
          })
        )
      )
      .map(response => JSON.parse(response.body))
      .do(response => playlist$.next(response.nextPageToken || null)) // prepare playlist$ for next call with nextPageToken
      .map(response => response.items.map(i => i.snippet.resourceId.videoId))
      .concatMap(ids => this.videos(ids, interval).items)
      .do(() => flusher$.next(++count % max === 0)) // confirm playlist$ next call at last item in previous result

    return {
      about: about$,
      items: items$
    }
  }

  videos(ids, interval = 0){
    var ids = Array.isArray(ids) ? ids : [ids]

    const about$ = new Rx.Subject()
    const items$ = Rx.Observable
      .fromPromise(
        gapi.client.youtube.videos
          .list({
            id: ids.join(','),
            part: 'id,snippet,contentDetails,statistics'
          })
      )
      .map(response => JSON.parse(response.body))
      .do(response => about$.next(response))
      .map(response => response.items)
      .concatMap(videos =>
        Rx.Observable
          .from(ids)
          .filter(id => !videos.map(video => video.id).includes(id)) // filter results ids
          .map(id => new Error('Youtube video **' + id + '** is unavailable'))
          .concat(videos)
          .mergeMap((v, i) => Rx.Observable.of(v).delay(i * interval))
      )

    return {
      about: about$,
      items: items$
    }
  }
}

export default new yapi
