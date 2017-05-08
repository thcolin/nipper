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
        .map(index => !state[index].selected ? state[index] : videoDuck.default(state[index], {type: videoDuck.DOWNLOAD, to: action.to}))
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
    .mergeMap(action => !store.getState().context.downloading ? Rx.Observable.never() : Rx.Observable.of(action))
    .map(() => store.getState().videos)
    .map(obj => Object.values(obj))
    .mergeMap(videos => Rx.Observable.of(videos)
      .concatAll()
      .filter(video => video.selected)
      .mergeMap((video, index) => {
        const results$ = epyd(video.id, video.id3)

        return Rx.Observable.merge(
          results$.progress
            .map(progress => videoDuck.progressVideo(video.id, progress)),
          results$.file
            .do(file => saveAs(file, file.name))
        )
        .takeWhile(action => action.constructor.name !== 'File')
      }, null, 3)
      .concat(Rx.Observable.of(downloadVideos()))
      .takeUntil(action$.ofType(DOWNLOAD))
    )
}
