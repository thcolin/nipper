import gapi from 'services/gapi'
import Rx from 'rxjs/Rx'

class yapi{
  playlist(id, interval = 250, max = 50){
    const playlist$ = new Rx.Subject()
    const flusher$ = new Rx.Subject().filter(b => b)
    var count = 0

    setTimeout(() => {
      playlist$.next(undefined)
      flusher$.next(true)
    })

    return playlist$
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
      .concatMap(ids => this.videos(ids, interval))
      .do(() => flusher$.next(++count % max === 0)) // confirm playlist$ next call at last item in previous result
  }

  videos(ids, interval = 0){
    var ids = Array.isArray(ids) ? ids : [ids]

    return Rx.Observable
      .fromPromise(
        gapi.client.youtube.videos
          .list({
            id: ids.join(','),
            part: 'id,snippet,contentDetails,statistics'
          })
      )
      .map(response => JSON.parse(response.body))
      .map(response => response.items)
      .concatMap(videos =>
        Rx.Observable
          .from(ids) // string id means error
          .filter(id => !~videos.map(video => video.id).indexOf(id)) // filter results ids
          .concat(videos)
          .mergeMap((v, i) => Rx.Observable.of(v).delay(i * interval))
      )
  }

  total(id){
    if(id.length === 11){
      // not a playlist, video
      return Rx.Observable.of(1)
    }

    return Rx.Observable
      .fromPromise(
        gapi.client.youtube.playlists
          .list({
            id: id,
            part: 'contentDetails'
          })
      )
      .map(response => JSON.parse(response.body))
      .map(response => response.items[0].contentDetails.itemCount)
  }
}

export default new yapi
