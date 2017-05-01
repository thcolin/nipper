import Rx from 'rxjs/Rx'
import { combineEpics } from 'redux-observable'
import * as videoDuck from 'ducks/video'
import epyd from 'services/epyd'
import saveAs from 'save-as'
// import streamSaver from 'StreamSaver'
// import 'web-streams-polyfill'
// import jszip from 'jszip'

// Actions
const SHIFT = 'epyd/videos/SHIFT'
const CLEAR = 'epyd/videos/CLEAR'
const DOWNLOAD = 'epyd/videos/DOWNLOAD'

// Reducer
const initial = {
  /* EXAMPLE :
    'Y2vVjlT306s' : [object Video],
    '8G1LZ7Xva04' : [object Video],
  */
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case SHIFT:
      return Object.keys(state)
        .map(index => videoDuck.default(state[index], {type: videoDuck.SHIFT, to: action.to}))
        .reduce((accumulator, video) => {
          accumulator[video.id] = video
          return accumulator
        }, {})
    case CLEAR:
      return initial
    case videoDuck.INCLUDE:
    case videoDuck.SHIFT:
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
export const shiftVideos = (to) => ({
  type: SHIFT,
  to
})

export const clearVideos = () => ({
  type: CLEAR
})

export const downloadSelection = () => ({
  type: DOWNLOAD
})

// Epics
export const epic = combineEpics(
  downloadSelectionEpic,
  videoDuck.epic
)

export function downloadSelectionEpic(action$, store){
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
    .mergeMap(video => epyd(video.id, video.id3, {
        workize: true,
        progress: true
      })
      .retry(2)
      .switchMap(value => {
        if(typeof value === 'number'){ // progress
          return Rx.Observable.of(videoDuck.progressVideo(video.id, value))
        } else{
          return Rx.Observable.of(value)
            .do(file => saveAs(file, file.name))
            .map(() => videoDuck.shiftVideo(video.id, false))
        }
      })
    , null, 3)
}
