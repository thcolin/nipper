import gapi from 'gapi-client'
import config from 'config'

class epyd{
  constructor(){
    gapi.load('client', () => {
      gapi.client.load('youtube', 'v3', () => {
        gapi.client.setApiKey(config.apiKey)
        console.log('gapi loaded')
      })
    })
  }

  playlist(id, token = null){
    return gapi.client.youtube.playlistItems
      .list({
        playlistId: id,
        part: 'snippet',
        maxResults: 10,
        pageToken: token
      })
      .then((result) => {
        return JSON.parse(result.body)
      })
  }

  videos(ids){
    ids = (Array.isArray(ids) ? ids:[ids])

    return gapi.client.youtube.videos
      .list({
        id: ids.join(','),
        part: 'id,snippet,contentDetails,statistics',
      })
      .then((result) => {
        return JSON.parse(result.body)
      })
      .then((result) => {
        let received = result.items.map(item => item.id)
        result.errors = ids.filter(id => (received.indexOf(id) === -1))
        return result
      })
  }
}

export default new epyd
