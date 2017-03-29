import epyd from './src/services/epyd'
import fetch from 'node-fetch' // TODO : Remove if universal

var fs = require('fs')

process.on('unhandledRejection', (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

// 240p
fetch('https://i.ytimg.com/vi/ryti_lCKleA/sddefault.jpg')
  .then(response => response.buffer())
  .then(buffer => ({
    id: '03JmIUFxdbE',
    id3: {
      song: 'Hello',
      artist: 'World',
      cover: buffer
    }
  }))
.then((video) => {
  return epyd.process(video.id, video.id3)
    .then((stream) => {
      console.log('write', stream)
      fs.writeFileSync('./buffer.mp3', stream.buffer)
    })
})
// epyd.process('GmtPBX5awFo') // 1080p
// epyd.process('lhnmbCW93yw') // 480p
// epyd.process('kF4M9_dWkgE') // 1080p
