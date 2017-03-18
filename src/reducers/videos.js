const videos = (state = [], action) => {
  switch(action.type){
    case 'RECEIVE_ANALYZE':
      return []
    case 'RECEIVE_VIDEO':
      let videos = state.slice()
      let video = {
        id: action.item.id,
        selected: false,
        details: {
          title: action.item.snippet.title,
          author: action.item.snippet.channelTitle,
          channel: action.item.snippet.channelId,
          description: action.item.snippet.description,
          thumbnail: (action.item.snippet.thumbnails.standard ? action.item.snippet.thumbnails.standard.url:action.item.snippet.thumbnails.high.url),
          duration: action.item.contentDetails.duration
        },
        statistics: {
          views: parseInt(action.item.statistics.viewCount),
          likes: parseInt(action.item.statistics.likeCount),
          dislikes: parseInt(action.item.statistics.dislikeCount)
        },
        id3: {
          artist: 'Hello',
          title: 'World'
        }
      }

      videos.push(video)
      return videos
    case 'SHIFT_VIDEO':
      return state.map(v => {
        if(v.id === action.id){
          v.selected = !v.selected
        }

        return v
      })
    case 'SHIFT_VIDEOS':
      return state.map(v => {
        v.selected = action.to
        return v
      })
    default:
      return state
  }
}

export default videos
