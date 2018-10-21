# Nipper

🌶 💽&nbsp; YouTube playlist (& video) ripper

Parse **YouTube** video or playlist link, fix inaccurate metadata (**cover**, **artist** & **song**), choose export codec (**mp4**, **webm**, **aac**, **mp3** or **ogg**), and download on-by-one or zipped (best stream chosen by default) ! Every process are made **directly in the browser**, like stream downloading or converting, with the help of [Kagami/ffmpeg.js](https://github.com/Kagami/ffmpeg.js) ❤️

_Currently, covert art support is limited to mp3 codec._

![Screenshot](https://raw.githubusercontent.com/thcolin/nipper/version/2.0.0/screenshot.png)

## Scripts
* `dev` _start a development server at `:8000`_
* `proxy`  _start proxy at `:7000` (**required**)_
* `doc` _start a documentation server at `:3000`_
* `test` _run linter, unit tests and e2e tests_
* `build` _build a production bundle into `dist` folder_

## Configuration
Copy `.env.example` to `.env` and configure it as you wish

```bash
# YOUTUBE SERVICE:
# Go to [Google Cloud Platform](https://console.cloud.google.com/apis/credentials),
# Enable "Youtube Data API v3" service
# Create "API key" credentials
# Restrict API key by domain name to secure access
YOUTUBE_API_KEY=''
```

## Roadmap
* [ ] Merge `src/store/formats` and `src/store/codecs`
* [ ] Write `e2e` tests with [Cypress](https://www.cypress.io/)
* [ ] Add badges (like `travis` and `standard` with [Shields](https://shields.io/))
* [ ] Configure `https`
* [ ] Record performances, memory, cpu, time for big playlist dig action
* [ ] Create `redux` + `rxjs` workflow diagram
* [ ] Use [Side Sheet](https://evergreen.surge.sh/components/side-sheet) over `Modal` for configuration

## Database
```js
{
  tracks: {
    'youtube#track#_IS208pkFxs': {
      uri: 'youtube#track#_IS208pkFxs',
      service: 'youtube',
      kind: 'track',
      id: '_IS208pkFxs',
      title: 'Midival Punditz - Raanjhan',
      author: 'inMindbodysoul',
      link: 'https://youtu.be/_IS208pkFxs',
      channel: 'UCgEmK9phN-_Ty7d_Jv6BQTg',
      description: 'Two musicians, Gaurav Raina and Tapan Raj, contributing to the evolution of music.. featuring Abida Parveen',
      thumbnail: 'https://i.ytimg.com/vi/_IS208pkFxs/sddefault.jpg',
      duration: '06:05',
      artist: 'Midival Punditz',
      song: 'Raanjhan',
      attachments: {
        'cover.jpg': [Blob],
        'track.mp3': [Blob],
        'track.aac': [Blob],
        'track.ogg': [Blob],
        'track.mp4': [Blob],
        'track.webm': [Blob],
      }
    },
  }
}
```

## State
```js
{
  api: {
    ready: true,
    broken: false
  },
  digger: {
    'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
      uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
      service: 'youtube',
      kind: 'playlist',
      id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
      done: true,
      error: null
    }
  },
  downloader: {
    default: {},
    zip: {
      'youtube#track#Qjp4uxGH9jI': 27,
      'youtube#track#sZUp9rXAK50': 81
    }
  },
  library: {
    'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF': {
      uri: 'youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
      service: 'youtube',
      kind: 'playlist',
      id: 'PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
      title: 'INDIA',
      author: 'Vincent Anthony',
      link: 'https://www.youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF',
      channel: 'https://www.youtube.com/channel/UC4T79MEKtNfa-PKpgwF0y9g',
      description: '',
      total: 8,
      thumbnail: 'https://i.ytimg.com/vi/a4F1Dm9Fat8/hqdefault.jpg',
      synced: 8,
      tracks: [
        'youtube#track#_IS208pkFxs',
        'youtube#track#a4F1Dm9Fat8',
        'youtube#track#Qjp4uxGH9jI',
        'youtube#track#sZUp9rXAK50',
        'youtube#track#x9BUOcEUCAk',
        'youtube#track#428Orzv3grA',
        'youtube#track#M7gDEwUb4_Q',
        'youtube#track#qhWlptdnLBs'
      ],
      latest: 1540085743390
    }
  },
  preferences: {
    format: 'mp3'
  },
  selection: [
    'youtube#track#Qjp4uxGH9jI',
    'youtube#track#sZUp9rXAK50',
  ],
  toaster: {}
}
```

## Research
* How to improve metadata writing ?
  * Codecs
    * Audio : `mp3/mp3`, `m4a/aac`, `ogg/vorbis`, `opus/opus`
    * Video : `mp4/mp4`, `webm/webm`
  * `FFMPEG`
    * `mp3` : `ffmpeg -i infile.mp3 -i cover.jpg -map 0 -map 1:0 -c:a copy -metadata artist="$ARTIST" -metadata title="$SONG" outfile.mp3`
      * [x] title
      * [x] author
      * [x] cover
    * `aac` : `ffmpeg -i infile.m4a -c:a copy -metadata artist="$ARTIST" -metadata title="$SONG" -f mp4 outfile.m4a`
      * [x] title
      * [x] author
      * [ ] cover
        * Look at [mp4box.js](https://github.com/gpac/mp4box.js/)
    * `vorbis` : `ffmpeg -i infile.ogg -c:a copy -metadata artist="$ARTIST" -metadata title="$SONG" outfile.ogg`
      * [x] title
      * [x] author
      * [ ] cover
        * Look at [vorbiscomments: METADATA_BLOCK_PICTURE](https://wiki.xiph.org/VorbisComment#METADATA_BLOCK_PICTURE)
    * `opus` : `ffmpeg -i infile.opus -c:a copy -metadata artist="$ARTIST" -metadata title="$SONG" outfile.opus`
      * [x] title
      * [x] author
      * [ ] cover
        * `opus` metadata is like `ogg` (cf. `vorbis`)
  * Unable to build `ffmpeg.js` with cover art support, need to compile `zlib` with `emscripten` (for `mp3`)
  * `ffmpeg` doesn't support cover art for `ogg (vorbis, opus)` and `aac` [ffmpeg metadata](https://wiki.multimedia.cx/index.php/FFmpeg_Metadata)
    * [tinytag](https://github.com/devsnd/tinytag) could be an alternative
    * [taglib](http://taglib.org/) too

## Helpful
* [Three Ways to Title Case a Sentence in JavaScript](https://medium.freecodecamp.com/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27#.cqak4s9ps)
* [Making a case for letter case](https://medium.com/@jsaito/making-a-case-for-letter-case-19d09f653c98#.1gt8kw4l3)
  * Or, "Which words I should ignore when capitalize a string ?"

## Alternatives
* [Videoder](https://www.videoder.net/)

## Thanks
* [Nipper the dog](https://en.wikipedia.org/wiki/Nipper)
* [Logo from iconmonstr](http://iconmonstr.com/sound-wave-1/)
* [Inspiration for logo animation](http://tobiasahlin.com/spinkit/)
* [SVG logo animation](http://codepen.io/anon/pen/ojgwr)
* [Background pattern](http://www.heropatterns.com/)
* [UnDraw illustrations](https://undraw.co/)
