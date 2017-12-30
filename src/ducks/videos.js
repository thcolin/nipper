import { combineEpics } from 'redux-observable'
import Rx from 'rxjs/Rx'
import * as contextDuck from 'ducks/context'
import * as videoDuck from 'ducks/video'
import * as errorDuck from 'ducks/error'
import epyd, { CODECS } from 'services/epyd'
import shajs from 'sha.js'
import saveAs from 'save-as'
import JSZip from 'jszip'

// Actions
export const INCLUDE = 'nipper/videos/INCLUDE'
export const SELECT = 'nipper/videos/SELECT'
export const CLEAR = 'nipper/videos/CLEAR'
export const DOWNLOAD = 'nipper/videos/DOWNLOAD'

// Reducer
const initial = {
  entities: {
    /* EXAMPLE :
      '30fff21e-469a-437c-8cd4-483a9348ad15' : [object Video],
      '5d50021a-b823-414c-83fe-37138c03af5f' : [object Video]
    */
  },
  result: [
    /* EXAMPLE :
      '30fff21e-469a-437c-8cd4-483a9348ad15', '5d50021a-b823-414c-83fe-37138c03af5f'
    */
  ]
}

export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case INCLUDE:
      return {
        entities: Object.assign({}, state.entities, action.actions
          .reduce((accumulator, current) => Object.assign(accumulator, { [current.uuid]: current.video }), {})
        ),
        result: state.result.concat(action.actions.map(action => action.uuid))
      }
    case SELECT:
      return {
        entities: state.result
          .map(uuid => state.entities[uuid])
          .map(video => videoDuck.default(video, {type: videoDuck.SELECT, to: action.to}))
          .reduce((accumulator, video) => {
            accumulator[video.uuid] = video
            return accumulator
          }, {}),
        result: state.result
      }
    case contextDuck.CONFIGURE:
      return {
        entities: state.result
          .map(uuid => state.entities[uuid])
          .map(video => videoDuck.default(video, {type: videoDuck.CONFIGURE, format: action.format}))
          .reduce((accumulator, video) => {
            accumulator[video.uuid] = video
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
          [action.uuid]: videoDuck.default(state.entities[action.uuid] || {}, action)
        },
        result: (state.result.includes(action.uuid) ? state.result : state.result.concat(action.uuid))
      }
    default:
      return state
  }
}

// Actions Creators
export const includeVideos = (videos) => ({
  type: INCLUDE,
  actions: videos.map(video => videoDuck.includeVideo(video))
})

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
    .mergeMap(() => {
      const videos = Object.values(store.getState().videos.entities).filter(video => video.selected)
      const archive = new JSZip()
      const names = {}

      const title = store.getState().context.title
      const author = store.getState().context.author
      const hash = shajs('sha256').update(videos.map(video => video.id).join('')).digest('hex').substring(0, 7)
      const filename = `Nipper - ${title} (${author}) - ${hash}.zip`

      const selection$ = Rx.Observable.of(videos)
        .concatAll()

      const cancel$ = selection$
        .filter(video => video.progress !== null)
        .map(video => videoDuck.downloadVideo(video.uuid))

      const bootstrap$ = !store.getState().context.downloading ? Rx.Observable.never() : selection$
        .map(video => videoDuck.progressVideo(video.uuid, 0))

      const download$ = !store.getState().context.downloading ? Rx.Observable.never() : selection$
        .mergeMap(video => epyd.proceed(video.id, CODECS[store.getState().context.format], video.tags)
          .mergeMap(msg => {
            if (msg.type === 'progress') {
              return Rx.Observable.of(videoDuck.progressVideo(video.uuid, msg.data))
            } else if (msg.type === 'done') {
              const name = msg.data.name
              const pound = names[name] || 0
              const basename = name.split('.').slice(0, -1).join('.')
              const extension = name.split('.').pop()
              const corrected = (pound > 0 ? basename + ` (${pound}).` + extension : basename + '.' + extension)
              names[name] = pound + 1

              archive.file(corrected, msg.data)
              return Rx.Observable.empty()
            }
          })
          .catch(error => Rx.Observable.of(
            videoDuck.progressVideo(video.uuid, 100),
            errorDuck.includeError('videos', error.message, true)
          ))
        )
        .concat(Rx.Observable.of(downloadVideos())
          .mergeMap(action => Rx.Observable
            .fromPromise(archive.generateAsync({type: 'blob'}))
            .mergeMap(blob => {
              if (Object.keys(archive.files).length) {
                saveAs(blob, filename)
                return Rx.Observable.of(action)
              } else {
                return Rx.Observable.of(errorDuck.includeError('videos', 'Sorry, **no video** could be downloaded, **try again later**', true), action)
              }
            })
          )
          .delay(1500)
        )
        .takeUntil(action$.ofType(DOWNLOAD, contextDuck.CLEAR))

      return Rx.Observable.merge(cancel$, bootstrap$, download$)
    })
}
