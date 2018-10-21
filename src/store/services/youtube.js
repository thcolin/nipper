import { of, from, merge, concat, throwError, EMPTY } from 'rxjs'
import { expand, filter, map, mergeMap, catchError, delay } from 'rxjs/operators'

const YOUTUBE_PLAYLIST_REGEXP = /(?:youtube\.com\/)(?:watch|playlist)(?:.*?list=)([^#&?=]{18,34})/
const YOUTUBE_VIDEO_REGEXP = /(?:youtu\.?be(?:\.com)?\/)(?:watch|embed|v)?(?:\/|\?)?(?:.*?v=)?([^#&?=]{11})/
const YOUTUBE_PLAYLIST_LINK = 'https://youtube.com/playlist?list=$1'
const YOUTUBE_VIDEO_LINK = 'https://youtu.be/$1'

function parseDurationFromISO8601 (source) {
  const matches = source.match(/P(.*?)T(\d+H)?(\d+M)?(\d+S)?/) || []

  const hours = (matches[2] || 'H').slice(0, -1)
  const minutes = (matches[3] || '0M').slice(0, -1)
  const seconds = (matches[4] || '0S').slice(0, -1)

  return [hours, minutes, seconds]
    .filter(value => value !== '')
    .map(value => value < 10 ? '0' + value : value)
    .join(':')
}

export default function inspect (link) {
  if (YOUTUBE_VIDEO_REGEXP.test(link)) {
    return video(link.match(YOUTUBE_VIDEO_REGEXP)[1])
  }

  if (YOUTUBE_PLAYLIST_REGEXP.test(link)) {
    return playlist(link.match(YOUTUBE_PLAYLIST_REGEXP)[1])
  }

  return throwError('Provide a **YouTube** video or playlist link')
}

export function destructLink (link) {
  let crumbs = null

  if (YOUTUBE_VIDEO_REGEXP.test(link)) {
    crumbs = {
      service: 'youtube',
      kind: 'video',
      id: link.match(YOUTUBE_VIDEO_REGEXP)[1]
    }
  } else if (YOUTUBE_PLAYLIST_REGEXP.test(link)) {
    crumbs = {
      service: 'youtube',
      kind: 'playlist',
      id: link.match(YOUTUBE_PLAYLIST_REGEXP)[1]
    }
  }

  if (!crumbs) {
    throw new Error('Provide a valid **YouTube** video or playlist link')
  }

  return {
    uri: Object.values(crumbs).join('#'),
    ...crumbs
  }
}

export function buildLink (uri) {
  return {
    video: YOUTUBE_VIDEO_LINK,
    playlist: YOUTUBE_PLAYLIST_LINK
  }[uri.split('#')[1]].replace('$1', uri.split('#')[2])
}

export function video (id) {
  return videos([id]).pipe(
    mergeMap(item => {
      if (item.kind === 'error') {
        return throwError(`YouTube video **${id}** is unavailable`)
      }

      const about = {
        uri: `youtube#record#${item.id}`,
        service: 'youtube',
        kind: 'record',
        id: item.id,
        subject: 'track',
        title: item.title,
        author: item.author,
        link: item.link,
        channel: item.channel,
        description: item.description,
        total: 1,
        thumbnail: item.thumbnail
      }

      return of(about, item)
    })
  )
}

export function playlist (id) {
  return from(gapi.client.youtube.playlists.list({ id, part: 'snippet,contentDetails' })).pipe(
    map(response => response.data || response.result),
    catchError(response => {
      let error = (response.Error || response.data.error)
      console.warn(`[youtube] page - ${error.message}`)
      return throwError(error.message)
    }),
    mergeMap(body => {
      const playlist = body.items.pop()

      if (!playlist) {
        return throwError(`YouTube playlist **${id}** is unavailable`)
      }

      const about = {
        uri: `youtube#record#${playlist.id}`,
        service: 'youtube',
        kind: 'record',
        id: playlist.id,
        subject: 'playlist',
        title: playlist.snippet.title,
        author: playlist.snippet.channelTitle,
        link: `https://www.youtube.com/playlist?list=${playlist.id}`,
        channel: `https://www.youtube.com/channel/${playlist.snippet.channelId}`,
        description: playlist.snippet.description,
        total: playlist.contentDetails.itemCount,
        thumbnail: Object.keys(playlist.snippet.thumbnails)
          .filter(key => ['standard', 'high', 'medium', 'default'].includes(key)) // fixed ratio
          .map(key => playlist.snippet.thumbnails[key])
          .reduce((previous, current) => current.width > previous.width ? current : previous, { width: 0 })
          .url
      }

      return merge(
        of(about),
        of({
          uri: 'youtube#page#null',
          service: 'youtube',
          kind: 'page',
          token: null
        }).pipe(
          expand(item => of(item).pipe(
            filter(item => item.kind === 'page'),
            delay(item.token ? 1000 : 0),
            mergeMap(item => page(id, 50, item.token)),
            mergeMap(body => {
              const payload = Array(body.nextPageToken ? 50 : (about.total % 50))
                .fill('')
                .map((foo, index) => body.items[index] ? body.items[index].snippet.resourceId.videoId : undefined)

              return concat(
                videos(payload),
                (!body.nextPageToken ? EMPTY : of({
                  uri: `youtube#page#${body.nextPageToken}`,
                  service: 'youtube',
                  kind: 'page',
                  token: body.nextPageToken
                }))
              )
            })
          ))
        )
      ).pipe(
        filter(item => item.kind !== 'page')
      )
    })
  )
}

function page (id, max, token) {
  return from(gapi.client.youtube.playlistItems.list({
    playlistId: id,
    part: 'snippet',
    maxResults: max,
    pageToken: token
  })).pipe(
    map(response => response.data || response.result),
    catchError(response => {
      let error = (response.Error || response.data.error)
      console.warn(`[youtube] page - ${error.message}`)
      return EMPTY
    })
  )
}

function videos (ids) {
  return from(gapi.client.youtube.videos.list({ id: ids.join(','), part: 'id,snippet,contentDetails' })).pipe(
    mergeMap(response => {
      const items = (response.data || response.result).items
      const range = items.map(item => item.id)

      const tracks = items
        .map(item => ({
          uri: `youtube#track#${item.id}`,
          service: 'youtube',
          kind: 'track',
          id: item.id,
          title: item.snippet.title,
          author: item.snippet.channelTitle,
          link: `https://www.youtube.com/watch?v=${item.id}`,
          channel: `https://www.youtube.com/channel/${item.snippet.channelId}`,
          description: item.snippet.description,
          duration: parseDurationFromISO8601(item.contentDetails.duration),
          thumbnail: Object.keys(item.snippet.thumbnails)
            .filter(key => ['standard', 'high', 'medium', 'default'].includes(key)) // fixed ratio
            .map(key => item.snippet.thumbnails[key])
            .reduce((previous, current) => current.width > previous.width ? current : previous, { width: 0 })
            .url
        }))

      const errors = ids
        .filter(id => !range.includes(id))
        .map(id => ({
          uri: `youtube#error#${id}`,
          service: 'youtube',
          kind: 'error',
          id,
          message: 'YouTube video **' + id + '** is unavailable'
        }))

      return of(...tracks, ...errors)
    }),
    catchError(response => {
      let error = typeof response === 'object' ? response.data.error : JSON.parse(response.body).error
      console.warn(`[youtube] videos - ${error.message}`)
      return EMPTY
    })
  )
}
