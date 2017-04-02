import React from 'react' // needed for JSX (used for the message in errors)
import yapi from 'services/yapi'
import epyd from 'services/epyd'
import getArtistTitle from 'get-artist-title'
import saveAs from 'save-as'
import { capitalize } from 'utils'

// analyze
export const processAnalyze = (kind, id, token = null, fresh = true) => (dispatch, getState) => {
  let promise
  let next = null

  switch(kind){
    case 'v':
      promise = yapi.videos(id)
        .then((result) => {
          dispatch(receiveAnalyze(kind, id, 1))
          return result
        })
    break
    case 'p':
      promise = yapi.playlist(id, token)
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
          return yapi.videos(ids)
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
              dispatch(parseVideo(item))
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
export const parseVideo = (item) => (dispatch, getState) => {
  var [ artist, song ] = getArtistTitle(item.snippet.title) || [null, null]

  var video = {
    id: item.id,
    selected: false,
    details: {
      title: item.snippet.title,
      author: item.snippet.channelTitle,
      channel: item.snippet.channelId,
      description: item.snippet.description,
      thumbnail: (item.snippet.thumbnails.standard ? item.snippet.thumbnails.standard.url:item.snippet.thumbnails.high.url),
      duration: item.contentDetails.duration
    },
    statistics: {
      views: parseInt(item.statistics.viewCount),
      likes: parseInt(item.statistics.likeCount),
      dislikes: parseInt(item.statistics.dislikeCount)
    },
    id3: {
      song: capitalize(song || item.snippet.title),
      artist: capitalize(artist || item.snippet.channelTitle),
      cover: null
    }
  }

  fetch(video.details.thumbnail)
    .then(response => response.arrayBuffer())
    .then(buffer => {
      video.id3.cover = buffer
      return video
    })
    .then(video => dispatch(receiveVideo(video)))
}

export const receiveVideo = (video) => ({
  type: 'RECEIVE_VIDEO',
  video
})

export const shiftVideo = (id) => ({
  type: 'SHIFT_VIDEO',
  id
})

export const shiftVideos = (to) => ({
  type: 'SHIFT_VIDEOS',
  to
})

export const editVideo = (id, key, value) => ({
  type: 'EDIT_VIDEO',
  id,
  key,
  value
})

export const downloadVideo = (id, id3) => (dispatch, getState) => {
  epyd.process(id, id3)
    .then(stream => {
      var blob = new Blob([stream.buffer], {type: 'audio/mpeg'})
      saveAs(blob, stream.id3.artist + ' - ' + stream.id3.song + '.mp3')
    })
}

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
