// // import gapi from 'gapi-client'
//
// class epyd{
//   constructor(){
//     this.gapi = window.gapi
//     this.gapi.auth.init(() => {
//       this.gapi.auth.authorize({
//         client_id: '568418378230-ll485fdsmdl0lfimpf4c7heg5tp3cale.apps.googleusercontent.com',
//         scope: 'https://www.googleapis.com/auth/youtube.readonly',
//         immediate: true
//       }, () => {
//         this.gapi.client.load('youtube', 'v3')
//       })
//     })
//   }
//
//   playlist(id){
//     console.log('playlist', id)
//     var result = this.gapi.client.youtube.playlistItems.list({
//       playlistId: id,
//       part: 'id,snippet,contentDetails',
//       maxResults: 50
//     }).then((result) => {
//       console.log(JSON.parse(result.body))
//     })
//   }
//
//   video(id){
//     console.log('video', id)
//   }
// }
//
// export default new epyd
