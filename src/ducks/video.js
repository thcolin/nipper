import { combineEpics } from 'redux-observable'
import getArtistTitle from 'get-artist-title'
import Rx from 'rxjs/Rx'
import * as errorDuck from 'ducks/error'
import epyd from 'services/epyd'
import saveAs from 'save-as'
import uuidv4 from 'uuid/v4'

// Actions
export const PARSE = 'victrola/videos/video/PARSE'
export const INCLUDE = 'victrola/videos/video/INCLUDE'
export const SELECT = 'victrola/videos/video/SELECT'
export const ANNOTATE = 'victrola/videos/video/ANNOTATE'
export const CONFIGURE = 'victrola/videos/video/CONFIGURE'
export const DOWNLOAD = 'victrola/videos/video/DOWNLOAD'
export const PROGRESS = 'victrola/videos/video/PROGRESS'

// Reducer
const initial = {
  /* EXAMPLE :
    uuid: '30fff21e-469a-437c-8cd4-483a9348ad15',
    id: 'Y2vVjlT306s',
    selected: false,
    format: 'mp3',
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
    tags: {
      artist: 'World',
      song: 'Hello',
      cover: [object Blob]
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
        tags: {
          ...state.tags,
          [action.key]: action.value
        }
      }
    case CONFIGURE:
      return {
        ...state,
        format: action.format
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
export const parseVideo = (raw) => ({
  type: PARSE,
  video: {
    uuid: uuidv4(),
    id: raw.id,
    selected: false,
    locked: false,
    progress: null,
    format: 'mp3',
    details: {
      title: raw.snippet.title,
      author: raw.snippet.channelTitle,
      channel: raw.snippet.channelId,
      description: raw.snippet.description,
      thumbnail: Object.keys(raw.snippet.thumbnails)
        .filter(key => ['standard', 'high', 'medium', 'default'].includes(key)) // fixed ratio
        .map(key => raw.snippet.thumbnails[key])
        .reduce((accumulator, thumbnail) => thumbnail.width > accumulator.width ? thumbnail : accumulator, { width: 0 })
        .url,
      duration: raw.contentDetails.duration
    },
    statistics: {
      views: parseInt(raw.statistics.viewCount),
      likes: parseInt(raw.statistics.likeCount),
      dislikes: parseInt(raw.statistics.dislikeCount)
    },
    tags: {
      artist: ((getArtistTitle(raw.snippet.title) || [null, null])[0] || raw.snippet.channelTitle),
      song: ((getArtistTitle(raw.snippet.title) || [null, null])[1] || raw.snippet.title),
      cover: null
    }
  }
})

export const includeVideo = (video) => ({
  type: INCLUDE,
  uuid: video.uuid,
  video: video
})

export const selectVideo = (uuid, to = null) => ({
  type: SELECT,
  uuid,
  to
})

export const lockVideo = (uuid, to = null) => ({
  type: SELECT,
  uuid,
  to
})

export const configureVideo = (uuid, format) => ({
  type: CONFIGURE,
  uuid,
  format
})

export const annotateVideo = (uuid, key, value) => ({
  type: ANNOTATE,
  uuid,
  key,
  value
})

export const downloadVideo = (uuid, tags = null) => ({
  type: DOWNLOAD,
  uuid,
  tags
})

export const progressVideo = (uuid, progress) => ({
  type: PROGRESS,
  uuid,
  progress
})

// Epics
export const epic = combineEpics(
  downloadVideoEpic
)

export function downloadVideoEpic(action$, store){
  return action$.ofType(DOWNLOAD)
    .mergeMap(action => store.getState().videos.entities[action.uuid].progress === null ? Rx.Observable.never() : Rx.Observable.of(action))
    .mergeMap(action => {
      const video = store.getState().videos.entities[action.uuid]

      return epyd(video.id, video.format, action.tags)
        .map(next => {
          switch(typeof next){
            case 'number':
              return progressVideo(action.uuid, next)
            case 'object':
              if(next.constructor.name === 'File'){
                saveAs(next, next.name)
              }

              return next
          }
        })
        .takeWhile(next => next.constructor.name !== 'File')
        .catch(error => Rx.Observable.of(errorDuck.includeError('videos', error.message, true)))
        .concat(Rx.Observable.of(downloadVideo(action.uuid)).delay(1500))
        .takeUntil(action$.ofType(DOWNLOAD).filter(next => next.uuid === action.uuid))
    })
    .filter(next => typeof next === 'object' && next.constructor.name === 'Object')
}
