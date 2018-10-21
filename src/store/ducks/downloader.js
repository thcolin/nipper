import { combineEpics, ofType } from 'redux-observable'
import { ajax } from 'rxjs/ajax'
import { of, from, concat, NEVER } from 'rxjs'
import { mergeMap, takeUntil, filter, tap, map, concatAll, pluck } from 'rxjs/operators'
import nippers from 'store/nippers'
import database from 'store/database'
import crawler from 'store/utils/crawler'
import CODECS from 'store/codecs'

// Actions
export const DOWNLOAD = 'nipper/downloader/DOWNLOAD'
export const PROGRESS = 'nipper/downloader/PROGRESS'
export const COMPLETE = 'nipper/downloader/COMPLETE'
export const ABORT = 'nipper/downloader/ABORT'
export const CLEAR = 'nipper/downloader/CLEAR'

// Reducer
const initial = {
  default: {
    // 'youtube#track#_IS208pkFxs': 50,
  }
}

export default function reducer (state = initial, action = {}) {
  switch (action.type) {
    case DOWNLOAD:
      return {
        ...state,
        [action.stack]: {
          ...state[action.stack] || {},
          ...action.tracks.reduce((progression, track) => ({ ...progression, [track]: 0 }), {})
        }
      }
    case PROGRESS:
      return {
        ...state,
        [action.stack]: {
          ...state[action.stack],
          [action.track]: action.progress
        }
      }
    case ABORT:
      return {
        ...state,
        [action.stack]: Object.keys(state[action.stack] || {})
          .filter(track => !action.tracks.includes(track))
          .reduce((progression, track) => ({ ...progression, [track]: state[action.stack][track] }), {})
      }
    case CLEAR:
      return initial
    default:
      return state
  }
}

// Actions Creators
export const doDownloads = (uri, format, context = {}, stack = 'default') => ({
  type: DOWNLOAD,
  tracks: Array.isArray(uri) ? uri : [uri],
  format,
  context,
  stack
})

export const progressDownload = (uri, progress, stack) => ({
  type: PROGRESS,
  track: uri,
  progress,
  stack
})

export const completeDownloads = (downloads, context = {}, stack = 'default') => ({
  type: COMPLETE,
  context,
  downloads,
  stack
})

export const abortDownloads = (uri, stack = 'default') => ({
  type: ABORT,
  tracks: Array.isArray(uri) ? uri : [uri],
  stack
})

export const clearDownloads = () => ({
  type: CLEAR
})

// Epics
const doDownloadsEpic = (action$, state$) => action$.pipe(
  ofType(DOWNLOAD),
  mergeMap(action => from(database.get()).pipe(
    mergeMap(instance => instance.tracks.find().where('uri').in(action.tracks).exec()),
    mergeMap(tracks => {
      const completed = {}

      return concat(
        of(tracks).pipe(
          concatAll(),
          mergeMap(track => {
            const attachment = track.getAttachment(`track.${action.format}`)

            if (attachment) {
              return from(attachment.getData()).pipe(
                map(blob => progressDownload(track.uri, 100, action.stack, blob))
              )
            } else {
              return of(track.getAttachment('cover.jpg')).pipe(
                mergeMap(cover => cover
                  ? from(track.getAttachment(`cover.jpg`).getData())
                  : crawler.schedule(ajax({ url: track.thumbnail, responseType: 'blob' })).pipe(
                    pluck('response'),
                    tap(cover => track.putAttachment({
                      id: 'cover.jpg',
                      data: cover,
                      type: 'image/jpeg'
                    }))
                  )
                ),
                mergeMap(cover => nippers[track.service](
                  track.id,
                  CODECS[action.format],
                  { artist: track.artist, song: track.song, cover }
                )),
                mergeMap(message => {
                  if (message.type === 'progress') {
                    return of(progressDownload(track.uri, message.data, action.stack))
                  } else if (message.type === 'done') {
                    completed[track.uri] = message.data
                    return of(progressDownload(track.uri, 100, action.stack))
                  } else {
                    return NEVER
                  }
                })
              )
            }
          })
        ),
        of(completed).pipe(
          map(downloads => completeDownloads(downloads, action.context, action.stack))
        )
      )
    }),
    takeUntil(action$.pipe(
      filter((next) =>
        (next.type === CLEAR) ||
        (next.type === ABORT && next.stack === action.stack && next.tracks.toString() === action.tracks.toString())
      )
    ))
  ))
)

export const epic = combineEpics(
  doDownloadsEpic
)
