import epyd from './src/services/epyd'

process.on('unhandledRejection', (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

epyd.process('03JmIUFxdbE') // 240p
// epyd.process('GmtPBX5awFo') // 1080p
// epyd.process('lhnmbCW93yw') // 480p
// epyd.process('kF4M9_dWkgE') // 1080p
