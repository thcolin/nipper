import getArtistTitle from 'get-artist-title'

const capitalize = (str) => {
  return str.toLowerCase()
    .split(' ')
    .filter((word) => !!word)
    .map((word, index) => {
      // filter words like 'a', 'an', 'the', 'and', 'or'
      if(index !== 0 && word.length < 4){
        return word
      } else if(word.match(/feat/)){
        return 'ft.'
      } else{
        return word.replace(word[0], word[0].toUpperCase())
      }
    })
    .join(' ')
}

const videos = (state = [], action) => {
  switch(action.type){
    case 'RECEIVE_ANALYZE':
      return []
    case 'RECEIVE_VIDEO':
      var videos = state.slice()

      var [ artist, title ] = getArtistTitle(action.item.snippet.title) || [null, null]

      var video = {
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
          artist: capitalize(artist || action.item.snippet.channelTitle),
          title: capitalize(title || action.item.snippet.title)
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
