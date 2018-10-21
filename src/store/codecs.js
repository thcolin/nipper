const CODECS = {
  mp3: {
    name: 'mp3',
    type: 'audio',
    extension: 'mp3',
    library: 'libmp3lame',
    options: ['-write_xing', '0'] // fix OS X quicklook
  },
  aac: {
    name: 'aac',
    type: 'audio',
    extension: 'm4a',
    library: 'aac'
  },
  vorbis: {
    name: 'vorbis',
    type: 'audio',
    extension: 'ogg',
    library: 'vorbis',
    options: ['-strict', '-2'] // vorbis encoder is experimental
  },
  opus: {
    name: 'opus',
    type: 'audio',
    extension: 'opus',
    library: 'libopus'
  },
  webm: {
    name: 'webm',
    type: 'video',
    extension: 'webm'
  },
  mp4: {
    name: 'mp4',
    type: 'video',
    extension: 'mp4'
  }
}

export default CODECS
