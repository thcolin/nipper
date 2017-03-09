export const analyze = (model, id) => {
  return {
    type: 'ANALYZE',
    model,
    id
  }
}

export const toggleVideos = (to) => {
  return {
    type: 'TOGGLE_VIDEOS',
    to
  }
}

export const setDownloading = (to) => {
  return {
    type: 'SET_DOWNLOADING',
    to
  }
}

export const downloadSelection = () => {
  return {
    type: 'DOWNLOAD_SELECTION'
  }
}
