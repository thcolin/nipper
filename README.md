# Nipper

🍒🎙️🐶️ Nipper - Youtube playlist (& video) ripper

Parse Youtube video or playlist link, fix inaccurate tags (cover, artist & song), choose wanted format (mp4, webm, aac, mp3 or ogg), and download on-by-one or zipped (best flux chosen by default) ! Every process are made directly in the browser, like downloading flux or converting them with [Kagami/ffmpeg.js](https://github.com/Kagami/ffmpeg.js) ❤️

Currently covert art are only supported on `mp3` format, `aac` and `vorbis` aren't supported.

![Nipper - Demo](resources/demo.jpg?raw=true)

## Run
* For development purpose: `npm run dev` (`:8080`, with CORS proxy at `:3000`)
* Build for production: `npm run build`, then `npm run start` (`:3000`) to check it out !
* Debug build size: `npm run debug`

## Config
```javascript
// move or duplicate `src/config.default.js` to `src/config.js`
export default {
  // WARNING : security breach, this api key will be readable in user browser,
  // because it will be used by client, the API Key should not be secured by IP or domain,
  // so be aware and careful, anyone who would look closely will be able to use it as they want
  apiKey: 'YOUTUBE_API_KEY'
}
```

## Handleable links
```javascript
/* PLAYLIST :
  youtube.com/watch?v=jmjx1r1omgY&index=1&list=FLj9CxlpVDiacX7ZlzuLuGiQ
  youtube.com/playlist?list=FLj9CxlpVDiacX7ZlzuLuGiQ
  youtube.com/watch?v=jmjx1r1omgY&index=1&list=PLOPWbKuLde8-uCnMXP4Z08POSJTyosuTD
  youtube.com/playlist?list=PLOPWbKuLde8-uCnMXP4Z08POSJTyosuTD
  youtube.com/playlist?list=PL5E26FD021DDB3A96
  youtube.com/watch?v=jmjx1r1omgY&index=1&list=PL5E26FD021DDB3A96
*/
var p = /(youtube\.com\/)(watch|playlist)(.*?list=)([^#\&\?\=]{18,34})/

/* VIDEO :
  youtu.be/gdPpp6X6lGk
  youtube.com/watch?v=gdPpp6X6lGk
  youtube.com/watch?param=true&v=gdPpp6X6lGk
  youtube.com/embed/gdPpp6X6lGk
  youtube.com/v/gdPpp6X6lGk
*/
var v = /(youtu\.?be(\.com)?\/)(watch|embed|v)?(\/|\?)?(.*?v=)?([^#\&\?\=]{11})/
```

## Youtube
```javascript
/* SUPPORTED FORMAT : [itag]: {format} */
var formats = {
  // standard videos
  17: {'vcodec': '3gp', 'acodec': 'aac', 'abr': 24, 'handicap': 1},
  18: {'vcodec': 'mp4', 'acodec': 'aac', 'abr': 96, 'handicap': 2},
  22: {'vcodec': 'mp4', 'acodec': 'aac', 'abr': 192, 'handicap': 4},
  37: {'vcodec': 'mp4', 'acodec': 'aac', 'abr': 192, 'handicap': 5},
  38: {'vcodec': 'mp4', 'acodec': 'aac', 'abr': 192, 'handicap': 6},
  43: {'vcodec': 'webm', 'acodec': 'vorbis', 'abr': 128, 'handicap': 2},
  44: {'vcodec': 'webm', 'acodec': 'vorbis', 'abr': 128, 'handicap': 3},
  45: {'vcodec': 'webm', 'acodec': 'vorbis', 'abr': 192, 'handicap': 4},
  46: {'vcodec': 'webm', 'acodec': 'vorbis', 'abr': 192, 'handicap': 5},
  59: {'vcodec': 'mp4', 'acodec': 'aac', 'abr': 128, 'handicap': 3},
  78: {'vcodec': 'mp4', 'acodec': 'aac', 'abr': 128, 'handicap': 3},

  // dash mp4 aac audio
  139: {'acodec': 'aac', 'abr': 48, 'handicap': 0},
  140: {'acodec': 'aac', 'abr': 128, 'handicap': 0},
  141: {'acodec': 'aac', 'abr': 256, 'handicap': 0},

  // dash webm vorbis audio
  171: {'acodec': 'vorbis', 'abr': 128, 'handicap': 0},
  172: {'acodec': 'vorbis', 'abr': 256, 'handicap': 0},

  // dash webm opus audio
  249: {'acodec': 'opus', 'abr': 50, 'handicap': 0},
  250: {'acodec': 'opus', 'abr': 70, 'handicap': 0},
  251: {'acodec': 'opus', 'abr': 160, 'handicap': 0}
}
```

## Structure
App state is managed with [redux](http://redux.js.org)

```javascript
{
  context: {
    subject: 'https://www.youtube.com/watch?v=8G1LZ7Xva04',
    format: 'mp3',
    total: 2,
    ready: true,
    downloading: false
  },
  errors: {
    entities: {
      '5d50021a-b823-414c-83fe-37138c03af5f': {
        uuid: '5d50021a-b823-414c-83fe-37138c03af5f',
        origin: 'state',
        children: 'Hello World !', // or simply JSX !
        closed: false
      }
    },
    result: ['5d50021a-b823-414c-83fe-37138c03af5f']
  },
  videos: {
    entities: {
      '30fff21e-469a-437c-8cd4-483a9348ad15': {
        uuid: '30fff21e-469a-437c-8cd4-483a9348ad15',
        id: 'Y2vVjlT306s',
        selected: false,
        format: 'mp3', // or anything in ['mp3', 'aac', 'vorbis', 'opus', 'mp4', 'webm']
        progress: 10, // int percentage or null
        details: {
          title: 'Hello - World',
          author: 'helloWorld',
          channel: 'UCj9CxlpVDiacX7ZlzuLuGiQ',
          description: 'Hello by World',
          thumbnail: 'https://i.ytimg.com/vi/ryti_lCKleA/sddefault.jpg',
          duration: 'PT3M11S'
        },
        statistics: {
          views: 0,
          likes: 0,
          dislikes: 0
        },
        tags: {
          song: 'Hello',
          artist: 'World',
          cover: [object Blob]
        }
      }
    },
    result: ['30fff21e-469a-437c-8cd4-483a9348ad15']
  }
}
```

## To Do
* look at [create-react-app/BOOTSTRAP.md](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md)
* next: 2 issues, 2 production & 2 polish

### Features
* [ ] help modal
  * app downloads
  * bitrate and formats table
  * explain process, features

### Issues
* [ ] history `previous` break the app
* [x] check `Video.Actions.ButtonDownload` and `DownloadVideos` animations (and `progress` too, it seems to reset when `converting`)
  * [x] `DownloadVideos` button reset (`100%` to `0%`) is visible to user: it should not
  * [x] `Video.Actions.ButtonDownload` doesn't seems to go to `100%` when finished in `epyd`, or too late
* [ ] disable `Video.Actions.ButtonInclude` when `downloading`
* [ ] disable `SelectFormat` when fetching videos, or fetching videos `format` need to be setted with `context.format`

### Refactoring
* 👻

### Environment
* [ ] correctly implement `hmr` (Hot Module Replacement)
  * replace only edited component
  * see [redux-observable doc](https://redux-observable.js.org/docs/recipes/HotModuleReplacement.html)

### Production
* [ ] code-coverage
* [ ] load `ffmpeg.worker.js` async possibly with [serviceworke.rs](https://serviceworke.rs/)
  * just when needed ? (cf. Lazy Loading)
  * show asset download progress on `Form` button (70%)
  * and init too (30%)
* [x] choose an host
  * [VPS-SSD from OVH - 3,59€/month](https://www.ovh.com/fr/vps/vps-ssd.xml)
* [ ] deploy on `:80` with `pm2` and [Nginx as a HTTP proxy](http://pm2.keymetrics.io/docs/tutorials/pm2-nginx-production-setup)
* [ ] "secondary" steps
  * [ ] `https` with [Let's Encrypt](https://letsencrypt.org/)
  * [ ] tests
    * [ ] unit
    * [ ] integration
    * [ ] e2e
  * [ ] travis-ci
  * [ ] auto-deploy on `release`

### Polish
* [ ] create a constant for `document.title`
* [ ] simplify `mapStateToProps` of `containers`
  * [ ] `ButtonDownloadVideos` should display `Done` when `progress` is `100`
  * [ ] use [react/reselect](https://github.com/reactjs/reselect) ?
* [ ] add comments on `epyd` exported functions
* [ ] `Thumbnail` image should be 4/3 (150x200 / 180x240)
* [ ] improve `FormAnalyst.ready` to `FormAnalyst.progress`
  * show progress of `loadJS` and `gapi`
  * end progress before ready
    * like [npProgress](http://victorbjelkholm.github.io/ngProgress/)
    * look at [ticker-stream](https://www.npmjs.com/package/ticker-stream) too
* [ ] use `immutable.js` and `normalizr` to normalize state shape ?
  * [Redux Documentation about Immutable](http://redux.js.org/docs/recipes/UsingImmutableJS.html)
  * implement `Error` and `Video` records [records](https://facebook.github.io/immutable-js/docs/#/Record)
* [ ] remove `Aphrodite` and use [react-with-styles](https://github.com/airbnb/react-with-styles)
* [ ] `proxy.js` should catch errors
  * like connection errors

### Apps
* [ ] fix `components` and `containers` file structure
* [ ] improve `npm run build` with arg `[web|mobile|desktop]`
* [ ] mobile + desktop apps
  * bubble likes transition between screens (`main`, `options`, `player`)
  * think about movements ux (swipe...)
    * add `Growl` like notifications (see `Spotify`), big square `opacity: 0.7` and `background: black`
  * `Library` (main)
    * `Header`
      * `Search` component
        * from `saved` Youtube playlists & links
        * recent ?
        * `Search more... ![Youtube Logo]()`
      * `Settings` three dots "button" for options on left
        * or gear, or Youtube profil picture
    * `Body`
      * `Filters` choose between `playlists` and `videos` views
      * `Toolbar` order by `x` (recent, a-z)
      * `Content` pull-up refresh
  * `Options`
    * clear history + cache is the main purpose
    * Youtube login
  * `Player`
    * on the bottom of the `main` screen, like Apple Music mobile app
    * toggle video / image cover (`width: 100%`)
    * controls : play, pause, next, previous, repeat, random, nexts ?
    * share music **file** feature ?


### Style
* [ ] look at [france.tv](https://www.france.tv/) design
* [ ] rethink # videos selected
  * currently `Badge` is ugly af
* [ ] rethink responsive design ui
  * [ ] hide `Video.Description` when `body.width < Xpx`
  * [ ] refactor `Video` disposition & height (keep the same fixed `~200px` if possible)
  * [ ] `Badge`
    * shadow on it ?
  * [ ] `Video`
    * be careful about `VirtualList` item height, fixed would be simpler
      * fixed video height for `VirtualList` ?
        * `About` and `Description` on same lines for `width < 810px` ?
  * [ ] fix video placeholder responsive design
* [ ] find a good ux way to handle thumbnail update from user (url or file)
  * modal ?
  * file : drop/down ? and what about copy/paste ?
  * url : ?
    * mobile double touch (one, display an overlay for file or link, second close it)

### Miscellaneous
* [ ] make universal ?
  * [ ] look at [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/)
* [ ] check performances (playlist with 1k videos ? memory ? cpu ? time ?)
  * each part of app
  * yapi `videos` or `playlist`
  * React array push `Video`
  * epyd `process` time (each method and global)
* [ ] document project
  * [ ] diagrams (cf. [RxJS Github](https://github.com/ReactiveX/rxjs#generating-png-marble-diagrams)) for README.md
  * [x] objects shapes - if standardized with `immutable.js` (`Error` and `Video`)
* [ ] `yaml` config
  * current `javascript object`, is it good ?
    * people can mess up

## Improvements
* how to improve metadata apply (with cover art) ?
  * from : `mp4/aac`, `3gp/aac`, `webm/vorbis`, `webm/opus`
  * to :
    * audio : `mp3/mp3`, `m4a/aac`, `ogg/vorbis`, `opus/opus`
    * video : `mp4/mp4`, `webm/webm`
  * use `ffmpeg` ?
    * `mp3` : `ffmpeg -i infile.mp3 -i cover.jpg -map 0 -map 1:0 -c:a copy -metadata artist="$ARTIST" -metadata title="$SONG" outfile.mp3`
      * title : [x]
      * author : [x]
      * cover : [ ]
        * fail to execute previous command with `ffmpeg.js` probably because of image input
        * look at [browser-id3-writer](https://github.com/egoroof/browser-id3-writer)
    * `aac` : `ffmpeg -i infile.m4a -c:a copy -metadata artist="$ARTIST" -metadata title="$SONG" -f mp4 outfile.m4a`
      * title : [x]
      * author : [x]
      * cover : [ ]
        * look at [mp4box.js](https://github.com/gpac/mp4box.js/)
    * `vorbis` : `ffmpeg -i infile.ogg -c:a copy -metadata artist="$ARTIST" -metadata title="$SONG" outfile.ogg`
      * title : [x]
      * author : [x]
      * cover : [ ]
        * look at [vorbiscomments: METADATA_BLOCK_PICTURE](https://wiki.xiph.org/VorbisComment#METADATA_BLOCK_PICTURE)
    * `opus` : `ffmpeg -i infile.opus -c:a copy -metadata artist="$ARTIST" -metadata title="$SONG" outfile.opus`
      * title : [x]
      * author : [x]
      * cover : [ ]
        * `opus` metadata is like `ogg` (cf. `vorbis`)
  * unable to build `ffmpeg.js` with cover art support, need to compile `zlib` with `emscripten` (for `mp3`)
  * `ffmpeg` doesn't support cover art for `ogg (vorbis, opus)` and `aac` [ffmpeg metadata](https://wiki.multimedia.cx/index.php/FFmpeg_Metadata)
    * [tinytag](https://github.com/devsnd/tinytag) could be an alternative
    * [taglib](http://taglib.org/) too


## Helpful
* [Three Ways to Title Case a Sentence in JavaScript](https://medium.freecodecamp.com/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27#.cqak4s9ps)
* [Making a case for letter case](https://medium.com/@jsaito/making-a-case-for-letter-case-19d09f653c98#.1gt8kw4l3)
  * Or, "Which words I should ignore when capitalize a string ?"
* [RxJS 5 pausableBuffered implementation](http://codepen.io/elhigu/pen/jqZmpV)

## Design
* [inVision](https://www.invisionapp.com/)
  * Header
  * Button
* [SeatGeek](https://seatgeek.com/)
  * Form
* [Soundy](https://www.soundy.top/sounds/new)
  * Button
  * Logo animation (auto)
  * Form

## Alternatives
* [VideoGrabby](http://www.videograbby.com/)

## Thanks
* [Nipper the dog](https://en.wikipedia.org/wiki/Nipper)
* [Logo from iconmonstr](http://iconmonstr.com/sound-wave-1/)
* [Inspiration for logo animation](http://tobiasahlin.com/spinkit/)
* [SVG logo animation](http://codepen.io/anon/pen/ojgwr)
* [Background picture from Amaryllis Liampoti](https://unsplash.com/photos/TDsEBM46YLA)
* [Empty placeholder](https://thenounproject.com)
  * Checkout `/resources/artworks/*.svg` for artists
