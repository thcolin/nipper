import { combineEpics } from 'redux-observable'
import Rx from 'rxjs/Rx'
import * as videoDuck from 'ducks/video'
import epyd from 'services/epyd'
import saveAs from 'save-as'
// import streamSaver from 'StreamSaver'
// import 'web-streams-polyfill'
// import jszip from 'jszip'

// Actions
export const SELECT = 'epyd/videos/SELECT'
export const CLEAR = 'epyd/videos/CLEAR'
export const DOWNLOAD = 'epyd/videos/DOWNLOAD'

// Reducer
const initial = {
  /* EXAMPLE :
    'Y2vVjlT306s' : [object Video],
    '8G1LZ7Xva04' : [object Video],
  */
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case SELECT:
      return Object.keys(state)
        .map(index => videoDuck.default(state[index], {type: videoDuck.SELECT, to: action.to}))
        .reduce((accumulator, video) => {
          accumulator[video.id] = video
          return accumulator
        }, {})
    case DOWNLOAD:
      return Object.keys(state)
        .map(index => videoDuck.default(state[index], {type: videoDuck.DOWNLOAD, to: action.to}))
        .reduce((accumulator, video) => {
          accumulator[video.id] = video
          return accumulator
        }, {})
    case CLEAR:
      return initial
    case videoDuck.INCLUDE:
    case videoDuck.SELECT:
    case videoDuck.LOCK:
    case videoDuck.ANNOTATE:
    case videoDuck.DOWNLOAD:
    case videoDuck.PROGRESS:
      return {
        ...state,
        [action.id]: videoDuck.default(state[action.id] || {}, action)
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
  // const archive = new jszip()
  // const output = streamSaver.createWriteStream('epyd.zip')
  //
  // archive.generateInternalStream()
  //   .resume()
  //   .on('data', (self, data, meta) => {
  //     console.log(self, data, meta)
  //   })

  return action$.ofType(DOWNLOAD)
    .map(() => store.getState().videos)
    .map(obj => Object.values(obj))
    .concatAll()
    .filter(video => video.selected)
    .mergeMap(video => !store.getState().context.downloading ?
      Rx.Observable.never() : epyd(video.id, video.id3, {
        workize: true,
        progress: true
      })
      .retry(2)
      .takeUntil(action$.ofType(DOWNLOAD))
      .switchMap(value => {
        if(typeof value === 'number'){ // progress
          return Rx.Observable.of(videoDuck.progressVideo(video.id, value))
        } else{
          return Rx.Observable.of(value)
            .do(file => saveAs(file, file.name))
            .map(() => videoDuck.selectVideo(video.id, false))
        }
      })
    , null, 3)
}
