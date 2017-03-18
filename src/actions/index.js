import React from 'react' // needed for JSX (used for the message in errors)
import epyd from 'services/epyd'

// analyze
export const processAnalyze = (kind, id, token = null, fresh = true) => (dispatch, getState) => {
  let promise
  let next = null

  switch(kind){
    case 'v':
      promise = epyd.videos(id)
        .then((result) => {
          dispatch(receiveAnalyze(kind, id, 1))
          return result
        })
    break
    case 'p':
      promise = epyd.playlist(id, token)
        .then((result) => {
          if(fresh){
            dispatch(receiveAnalyze(kind, id, result.pageInfo.totalResults, result.nextPageToken))
          }

          next = result.nextPageToken

          return result.items
        })
        .then((items) => {
          return items
            .map(item => item.snippet.resourceId.videoId)
        })
        .then((ids) => {
          return epyd.videos(ids)
        })
    break
  }

  promise
    .then((result) => {
      result.errors.forEach((error) => {
        dispatch(receiveError(<span>Youtube video <strong>{error}</strong> is unavailable</span>))
      })

      return result.items
    })
    .then((items) => {
      let promises = items.map((item, index) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if(getState().analyze.id !== id){
              reject()
            } else{
              dispatch(receiveVideo(item))
              resolve()
            }
          }, 300 * index)
        })
      })

      return Promise.all(promises)
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        if(next){
          setTimeout(() => {
            resolve()
          }, 500)
        } else{
          reject()
        }
      })
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        (function wait(){
          if(getState().analyze.id !== id){
            reject()
          } else if(!getState().analyze.pause){
            resolve()
          } else{
            setTimeout(wait, 1000)
          }
        })()
      })
    })
    .then(() => {
      dispatch(processAnalyze('p', id, next, false))
    })
}

export const receiveAnalyze = (kind, id, total, token = null) => ({
  type: 'RECEIVE_ANALYZE',
  id,
  kind,
  total,
  token
})

export const togglePause = () => ({
  type: 'TOGGLE_PAUSE'
})

// videos
export const receiveVideo = (item) => ({
  type: 'RECEIVE_VIDEO',
  item
})

export const shiftVideo = (id) => ({
  type: 'SHIFT_VIDEO',
  id
})

export const shiftVideos = (to) => ({
  type: 'SHIFT_VIDEOS',
  to
})

// errors
let nextError = 0

export const receiveError = (message) => ({
  type: 'RECEIVE_ERROR',
  id: nextError++,
  message
})

export const closeError = (id) => ({
  type: 'CLOSE_ERROR',
  id
})
