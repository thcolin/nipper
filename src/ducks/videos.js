import { combineEpics } from 'redux-observable'
import Rx from 'rxjs/Rx'
import * as contextDuck from 'ducks/context'
import * as videoDuck from 'ducks/video'
import * as errorDuck from 'ducks/error'
import epyd from 'services/epyd'
import saveAs from 'save-as'
import JSZip from 'jszip'

// Actions
export const SELECT = 'epyd/videos/SELECT'
export const CLEAR = 'epyd/videos/CLEAR'
export const DOWNLOAD = 'epyd/videos/DOWNLOAD'

// Reducer
const initial = {
  entities: {
    /* EXAMPLE :
      'Y2vVjlT306s' : [object Video],
      '8G1LZ7Xva04' : [object Video]
    */
  },
  result: [
    /* EXAMPLE :
      'Y2vVjlT306s', '8G1LZ7Xva04'
    */
  ]
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case SELECT:
      return {
        entities: state.result
          .map(id => state.entities[id])
          .map(video => videoDuck.default(video, {type: videoDuck.SELECT, to: action.to}))
          .reduce((accumulator, video) => {
            accumulator[video.id] = video
            return accumulator
          }, {}),
        result: state.result
      }
    case DOWNLOAD:
      return {
        entities: state.result
          .map(id => state.entities[id])
          .map(video => !video.selected ? video : videoDuck.default(video, {type: videoDuck.DOWNLOAD}))
          .reduce((accumulator, video) => {
            accumulator[video.id] = video
            return accumulator
          }, {}),
        result: state.result
      }
    case contextDuck.CONFIGURE:
      return {
        entities: state.result
          .map(id => state.entities[id])
          .map(video => videoDuck.default(video, {type: videoDuck.CONFIGURE, format: action.format}))
          .reduce((accumulator, video) => {
            accumulator[video.id] = video
            return accumulator
          }, {}),
        result: state.result
      }
    case CLEAR:
      return initial
    case videoDuck.INCLUDE:
    case videoDuck.SELECT:
    case videoDuck.ANNOTATE:
    case videoDuck.CONFIGURE:
    case videoDuck.DOWNLOAD:
    case videoDuck.PROGRESS:
      return {
        entities: {
          ...state.entities,
          [action.id]: videoDuck.default(state.entities[action.id] || {}, action)
        },
        result: (~state.result.indexOf(action.id) ? state.result : state.result.concat(action.id))
      }
    default:
      return state
  }
}

// Actions Creators
export const selectVideos = (to) => ({
  type: SELECT,
  to
})

export const clearVideos = () => ({
  type: CLEAR
})

export const downloadVideos = () => ({
  type: DOWNLOAD
})

// Epics
export const epic = combineEpics(
  downloadVideosEpic,
  videoDuck.epic
)

export function downloadVideosEpic(action$, store){
  return action$.ofType(DOWNLOAD)
    .mergeMap(action => !store.getState().context.downloading ? Rx.Observable.never() : Rx.Observable.of(action))
    .map(() => store.getState().videos.entities)
    .map(obj => Object.values(obj))
    .mergeMap(videos => {
      const archive = new JSZip()

      return Rx.Observable.of(videos)
        .concatAll()
        .filter(video => video.selected)
        .mergeMap(video => epyd(video.id, store.getState().context.format, video.tags)
          .map(next => {
            switch(typeof next){
              case 'number':
                return videoDuck.progressVideo(video.id, next)
              case 'object':
                if(next.constructor.name === 'File'){
                  archive.file(next.name, next)
                }

                return next
            }
          })
          .takeWhile(next => next.constructor.name !== 'File')
          .catch(error => Rx.Observable.of(
            videoDuck.progressVideo(video.id, 100),
            errorDuck.includeError('videos', error.message, true),
            undefined // needed to stop current
          ))
        , null, 3)
        .concat(Rx.Observable.of(downloadVideos())
          .mergeMap(action => Rx.Observable
            .fromPromise(archive.generateAsync({type: 'blob'}))
            .do(blob => Object.keys(archive.files).length ? saveAs(blob, 'epyd.zip') : null)
            .map(() => action)
          )
          .delay(1500)
        )
        .takeUntil(action$.ofType(DOWNLOAD))
    })
}
