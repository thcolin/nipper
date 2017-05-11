import { combineEpics } from 'redux-observable'
import getArtistTitle from 'get-artist-title'
import Rx from 'rxjs/Rx'
import epyd from 'services/epyd'
import saveAs from 'save-as'

// Actions
export const INCLUDE = 'epyd/videos/video/INCLUDE'
export const SELECT = 'epyd/videos/video/SELECT'
export const ANNOTATE = 'epyd/videos/video/ANNOTATE'
export const DOWNLOAD = 'epyd/videos/video/DOWNLOAD'
export const PROGRESS = 'epyd/videos/video/PROGRESS'

// Reducer
const initial = {
  /* EXAMPLE :
    id: 'Y2vVjlT306s',
    selected: false,
    progress: null, // or number
    details: {
      title: 'Hello - World',
      author: 'helloWorld',
      channel: 'UCj9CxlpVDiacX7ZlzuLuGiQ',
      description: 'Hello by World',
      thumbnail: 'https://i.ytimg.com/vi/ryti_lCKleA/sddefault.jpg',
      duration: 'PT3M11S'
    },
    statistics: {
      views: 0,
      likes: 0,
      dislikes: 0
    },
    id3: {
      artist: 'World',
      song: 'Hello',
      cover: [object ArrayBuffer]
    }
  */
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case INCLUDE:
      return action.video
    case SELECT:
      return {
        ...state,
        selected: (action.to === null ? !state.selected : action.to)
      }
    case ANNOTATE:
      return {
        ...state,
        id3: {
          ...state.id3,
          [action.key]: action.value
        }
      }
    case DOWNLOAD:
      return {
        ...state,
        progress: (state.progress === null ? 0 : null)
      }
    case PROGRESS:
      return {
        ...state,
        progress: action.progress
      }
    default:
      return state
  }
}

// Actions Creators
export const includeVideo = (raw, clean = false) => ({
  type: INCLUDE,
  id: raw.id,
  video: clean ? raw : {
    id: raw.id,
    selected: false,
    locked: false,
    progress: null,
    details: {
      title: raw.snippet.title,
      author: raw.snippet.channelTitle,
      channel: raw.snippet.channelId,
      description: raw.snippet.description,
      thumbnail: (raw.snippet.thumbnails.standard ? raw.snippet.thumbnails.standard.url:raw.snippet.thumbnails.high.url),
      duration: raw.contentDetails.duration
    },
    statistics: {
      views: parseInt(raw.statistics.viewCount),
      likes: parseInt(raw.statistics.likeCount),
      dislikes: parseInt(raw.statistics.dislikeCount)
    },
    id3: {
      artist: ((getArtistTitle(raw.snippet.title) || [null, null])[0] || raw.snippet.channelTitle),
      song: ((getArtistTitle(raw.snippet.title) || [null, null])[1] || raw.snippet.title),
      cover: null
    }
  }
})

export const selectVideo = (id, to = null) => ({
  type: SELECT,
  id,
  to
})

export const lockVideo = (id, to = null) => ({
  type: SELECT,
  id,
  to
})

export const annotateVideo = (id, key, value) => ({
  type: ANNOTATE,
  id,
  key,
  value
})

export const downloadVideo = (id, id3 = null) => ({
  type: DOWNLOAD,
  id,
  id3
})

export const progressVideo = (id, progress) => ({
  type: PROGRESS,
  id,
  progress
})

// Epics
export const epic = combineEpics(
  includeVideoEpic,
  downloadVideoEpic
)

export function includeVideoEpic(action$){
  return action$.ofType(INCLUDE)
    .filter(action => action.video.id3.cover === null)
    .mergeMap(action => Rx.Observable.ajax({url: action.video.details.thumbnail, responseType: 'arraybuffer'})
      .map(data => data.response)
      .map(buffer => [action.video.id, 'cover', buffer])
    )
    .map(args => annotateVideo(...args))
}

export function downloadVideoEpic(action$, store){
  return action$.ofType(DOWNLOAD)
    .mergeMap(action => store.getState().videos[action.id].progress === null ? Rx.Observable.never() : Rx.Observable.of(action))
    .mergeMap(action => {
      const results$ = epyd(action.id, action.id3)

      return Rx.Observable.merge(
        results$.progress
          .map(progress => progressVideo(action.id, progress)),
        results$.file
          .do(file => saveAs(file, file.name))
      )
      .takeWhile(next => next.constructor.name !== 'File')
      .concat(Rx.Observable.of(downloadVideo(action.id)).delay(1500))
      .takeUntil(action$.ofType(DOWNLOAD).filter(a => a.id === action.id))
    })
    .filter(next => typeof next === 'object' && next.constructor.name === 'Object')
}
