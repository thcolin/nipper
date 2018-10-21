import loadJS from 'load-js'

const GOOGLE_API_URL = 'https://apis.google.com/js/api.js'

export default () => typeof gapi !== 'undefined' ? new Promise(gapi) : loadJS([{
  url: GOOGLE_API_URL,
  cache: false
}])
// `gapi` is now available
  .then(() => new Promise(resolve => gapi.load('client', resolve)))
  .then(() => new Promise(resolve => gapi.client.load('youtube', 'v3', resolve)))
  .then(() => gapi)
