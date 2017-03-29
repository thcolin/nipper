import epyd from './src/services/epyd'

process.on('unhandledRejection', (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

// 240p
epyd.process('03JmIUFxdbE', {
  song: 'Hello',
  artist: 'World',
  cover: 'https://i.ytimg.com/vi/ryti_lCKleA/sddefault.jpg'
})
// epyd.process('GmtPBX5awFo') // 1080p
// epyd.process('lhnmbCW93yw') // 480p
// epyd.process('kF4M9_dWkgE') // 1080p
