import { combineEpics, ofType } from 'redux-observable'
import { mergeMap, pluck, map, concatAll, catchError } from 'rxjs/operators'
import { of, from, NEVER } from 'rxjs'
import identify from 'get-artist-title'
import database from 'store/database'
import * as diggerDuck from 'store/ducks/digger'

// Epics
const syncDatabaseEpic = (action$) => action$.pipe(
  ofType(diggerDuck.TRACKS),
  pluck('tracks'),
  mergeMap(tracks => from(database.get()).pipe(
    map(instance => ({ instance, tracks }))
  )),
  mergeMap(({ tracks, instance }) => of(tracks).pipe(
    concatAll(),
    mergeMap(track => from(instance.tracks.findOne().where('uri').eq(track.uri).exec()).pipe(
      map(doc => doc.toJSON()),
      catchError(e => of({
        ...track,
        artist: (identify(track.title) || [null, null])[0] || track.author,
        song: (identify(track.title) || [null, null])[1] || track.title
      })),
      mergeMap(track => from(instance.tracks.atomicUpsert(track))),
      mergeMap(() => NEVER)
    ))
  ))
)

export const epic = combineEpics(
  syncDatabaseEpic
)
