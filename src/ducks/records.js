import { combineEpics } from 'redux-observable'
import * as appDuck from 'ducks/app'

export const RECORDS_LIMIT = 15

// Actions
export const FILL = 'nipper/records/FILL'
export const INCLUDE = 'nipper/records/record/INCLUDE'

// Reducer
const initial = {
  entities: {},
  result: []
}

export default function reducer(state = initial, action = {}){
  switch (action.type) {
    case FILL:
      return {
        ...state,
        entities: action.entities,
        result: action.result
      }
    default:
      return state
  }
}

// Actions Creators
export const fillRecords = (records = []) => ({
  type: FILL,
  entities: records.reduce((obj, record) => Object.assign(obj, {
    [record.id]: record
  }), {}),
  result: records.map(record => record.id)
})

export const includeRecord = (record) => ({
  type: INCLUDE,
  record
})

// Epics
export const epic = combineEpics(
  initAppEpic,
  includeRecordEpic
)

export function initAppEpic(action$){
  return action$.ofType(appDuck.INIT)
    .map(() => {
      let records = JSON.parse(localStorage.records || '[]')
      return fillRecords(records)
    })
}

export function includeRecordEpic(action$){
  return action$.ofType(INCLUDE)
    .map(action => {
      let records = [action.record]
        .concat(JSON.parse(localStorage.records || '[]').filter(record => record.id !== action.record.id))
        .slice(0, RECORDS_LIMIT)

      localStorage.records = JSON.stringify(records)
      return fillRecords(records)
    })
}
