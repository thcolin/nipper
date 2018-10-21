const CODECS = {
  mp3: {
    name: 'mp3',
    value: 'mp3',
    children: 'Audio - mp3',
    icon: 'sound',
    type: 'audio',
    extension: 'mp3',
    library: 'libmp3lame',
    options: ['-write_xing', '0'] // fix OS X quicklook
  },
  aac: {
    name: 'aac',
    value: 'aac',
    children: 'Audio - aac',
    icon: 'sound',
    type: 'audio',
    extension: 'm4a',
    library: 'aac'
  },
  vorbis: {
    name: 'vorbis',
    value: 'vorbis',
    children: 'Audio - vorbis',
    icon: 'sound',
    type: 'audio',
    extension: 'ogg',
    library: 'vorbis',
    options: ['-strict', '-2'] // vorbis encoder is experimental
  },
  opus: {
    name: 'opus',
    value: 'opus',
    children: 'Audio - opus',
    icon: 'sound',
    type: 'audio',
    extension: 'opus',
    library: 'libopus'
  },
  webm: {
    name: 'webm',
    value: 'webm',
    children: 'Video - mp4',
    icon: 'video',
    type: 'video',
    extension: 'webm'
  },
  mp4: {
    name: 'mp4',
    children: 'Video - webm',
    icon: 'video',
    type: 'video',
    extension: 'mp4'
  }
}

export default CODECS
