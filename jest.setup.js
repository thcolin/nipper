const { google } = require('googleapis')

require('dotenv').config()

global.gapi = {
  client: {
    youtube: google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    })
  }
}
