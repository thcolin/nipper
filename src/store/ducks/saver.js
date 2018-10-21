import { combineEpics, ofType } from 'redux-observable'
import { mergeMap, map, tap, catchError } from 'rxjs/operators'
import { of, throwError } from 'rxjs'
import JSZip from 'jszip'
import saveAs from 'save-as'
import * as downloaderDuck from 'store/ducks/downloader'

// Epics
const saveDownloadsEpic = (action$) => action$.pipe(
  ofType(downloaderDuck.COMPLETE),
  mergeMap(action => of(Object.values(action.downloads)).pipe(
    mergeMap(files => files.length <= 1 ? of(files.slice(0, 1).pop()) : of(new JSZip()).pipe(
      tap(archive => files.forEach(file => {
        const occurrences = files.filter(occurrence => occurrence.name === file.name).length - 1
        const basename = file.name.split('.').slice(0, -1).map(s => s.replace(/[/\\]/, ':')).join('.')
        const extension = file.name.split('.').pop()

        archive.file(`${basename}${occurrences > 0 ? ` (${occurrences})` : ''}.${extension}`, file)
      })),
      mergeMap(archive => Object.keys(archive.files).length ? archive.generateAsync({ type: 'blob' }) : throwError()),
      map(blob => new File([blob], action.context.zip, { type: 'application/zip' }))
    )),
    tap(file => saveAs(file, file.name)),
    map(() => downloaderDuck.abortDownloads(Object.keys(action.downloads), action.stack)),
    catchError(e => {
      console.warn('[saver]', e)
      return of(downloaderDuck.abortDownloads(Object.keys(action.downloads), action.stack))
    })
  ))
)

export const epic = combineEpics(
  saveDownloadsEpic
)
