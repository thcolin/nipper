import gapi from 'gapi-client'

class yapi{
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

export default new yapi
