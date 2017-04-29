import { combineEpics } from 'redux-observable'
import getArtistTitle from 'get-artist-title'
import Rx from 'rxjs/Rx'
import epyd from 'services/epyd'
import saveAs from 'save-as'
import request from 'superagent'
import observify from 'superagent-rxjs'

observify(request)

// Actions
export const INCLUDE = 'epyd/videos/video/INCLUDE'
export const SHIFT = 'epyd/videos/video/SHIFT'
export const ANNOTATE = 'epyd/videos/video/ANNOTATE'
export const DOWNLOAD = 'epyd/videos/video/DOWNLOAD'
export const CANCEL = 'epyd/videos/video/CANCEL'
export const COMPLETE = 'epyd/videos/video/COMPLETE'

// Reducer
const initial = {
  /* EXAMPLE :
    id: 'Y2vVjlT306s',
    selected: false,
    downloading: false,
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
    case SHIFT:
      return {
        ...state,
        selected: (typeof action.to !== 'undefined' ? action.to : !state.selected)
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
        downloading: true
      }
    case CANCEL:
    case COMPLETE:
      return {
        ...state,
        downloading: false
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
    downloading: false,
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

export const shiftVideo = (id, to) => ({
  type: SHIFT,
  id,
  to
})

export const annotateVideo = (id, key, value) => ({
  type: ANNOTATE,
  id,
  key,
  value
})

export const downloadVideo = (id, id3) => ({
  type: DOWNLOAD,
  id,
  id3
})

export const cancelVideo = (id) => ({
  type: CANCEL,
  id
})

export const completeVideo = (id) => ({
  type: COMPLETE,
  id
})

// Epics
export const epic = combineEpics(
  includeVideoEpic,
  downloadVideoEpic,
  cancelVideoEpic
)

export function includeVideoEpic(action$){
  return action$.ofType(INCLUDE)
    .filter(action => action.video.id3.cover === null)
    .mergeMap(action => request
      .get(action.video.details.thumbnail)
      .responseType('arraybuffer')
      .observify()
      .map(response => response.body)
      .map(buffer => [action.video.id, 'cover', buffer])
    )
    .map(args => annotateVideo(...args))
}

export function downloadVideoEpic(action$, store){
  return action$.ofType(DOWNLOAD)
    .mergeMap(action => epyd(action.id, action.id3, true)
      .retry(2)
      .takeUntil(action$.ofType(CANCEL))
      .do(file => saveAs(file, file.name))
      .map(() => completeVideo(action.id))
    )
}

export function cancelVideoEpic(action$, store){
  return action$.ofType(CANCEL)
    .mergeMap(() => Rx.Observable.never())
}
