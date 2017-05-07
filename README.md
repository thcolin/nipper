# epyd.js
Epyd (Easy Playlist Youtube Downloadr) vous permet de télécharger vos vidéos et playlists Youtube directement en MP3 avec les tags ID3 remplis correctement (Titre, Artiste, Pochette).

![epyd.js - Landing](http://i.imgur.com/0lH1zEa.jpg)
![epyd.js - Toolbar](http://i.imgur.com/en4fzXY.png)
![epyd.js - Empty Placholder](http://i.imgur.com/K5eU6Uq.png)
![epyd.js - List](http://i.imgur.com/bXCDXna.png)

## Tags ID3
* La pochette est définis par le Thumbnail de la vidéo
* L'artiste (Si le titre de la vidéo est au format "Artiste * Titre")
* Le titre (Toujours pareil, si le titre est au format "Artiste * Titre")

## Usage
Vous pouvez au choix, télécharger juste une vidéo au format MP3, ou en sélectionner plusieurs (si vous checkez une playlist par exemple) et télécharger un zip de toutes ces vidéos en MP3.

## Config
```js
// move or duplicate `src/config.default.js` to `src/config.js`
export default {
  // WARNING : security breach, this api key will be readable in user browser,
  // because it will be used by client, the API Key should not be secured by IP or domain,
  // so be aware and careful, anyone who would look closely will be able to use it as they want
  apiKey: 'YOUTUBE_API_KEY',
  // WARNING : if universal, all epyd process will be executed in user browser and proxified by server (CORS policy)
  // download entire (possibly HD) video on client side, just to extract audio, could be painful for user with small bandwidth
  // therefore, in production, you'll should prefer to let the server handle epyd process and set this to `false`
  universal: true
}
```

## Handleable links
```js
/* PLAYLIST :
  youtube.com/watch?v=jmjx1r1omgY&index=1&list=FLj9CxlpVDiacX7ZlzuLuGiQ
  youtube.com/playlist?list=FLj9CxlpVDiacX7ZlzuLuGiQ
  youtube.com/watch?v=jmjx1r1omgY&index=1&list=PLOPWbKuLde8-uCnMXP4Z08POSJTyosuTD
  youtube.com/playlist?list=PLOPWbKuLde8-uCnMXP4Z08POSJTyosuTD
  youtube.com/playlist?list=PL5E26FD021DDB3A96
  youtube.com/watch?v=jmjx1r1omgY&index=1&list=PL5E26FD021DDB3A96
*/
var p = /(youtube\.com\/)(watch|playlist)(.*?list=)([^#\&\?\=]{24,34})/

/* VIDEO :
  youtu.be/gdPpp6X6lGk
  youtube.com/watch?v=gdPpp6X6lGk
  youtube.com/watch?param=true&v=gdPpp6X6lGk
  youtube.com/embed/gdPpp6X6lGk
  youtube.com/v/gdPpp6X6lGk
*/
var v = /(youtu\.?be(\.com)?\/)(watch|embed|v)?(\/|\?)?(.*?v=)?([^#\&\?\=]{11})/
```

## Structure
```
{
  context: {
    total: 10, // default null
    pause: false,
    downloading: false
  },
  errors: [
    {
      id: 1,
      children: 'Hello World !' // or simply JSX !
    }
  ],
  videos: [
    {
      id: 'Y2vVjlT306s',
      selected: false,
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
      id3: {
        song: 'Hello',
        artist: 'World',
        cover: [object ArrayBuffer]
      }
    }
  ]
}
```

## Customize
* background image
* colors

## TODO
* [x] polish containers naming
* [ ] make a `keys` state for `videos` and `errors`
  * avoid `Object.keys(state.videos).map(id => state.videos[id])` on containers
* [ ] slow down `epyd.progress$`
* [ ] fix `downloadSelection()`
  * [x] show global progress
  * [x] enable global cancellation
  * use `downloadVideo()` ? or distinguish `videos` (selection) process from `video` (single) ?
    * currently not using `downloadVideo()`, and video progress isn't set to "done"
      * if, enable cancellation ?
        * don't, it would be against separated flow
  * [x] user shouldn't be allowed to `selectVideo()`
    * [x] and selection too (global)
    * see `video.locked`
  * [ ] fix completion
    * throw an `epyd/videos/DOWNLOAD` event to reset `state.context.downloading`
  * DON'T DOWNLOAD VIDEO ON THE FLY ! ZIP THEM !
    * `Chrome` can only handle one instance of `saveAs()`
    * and i can't differ `saveAs()` by success or error because it isn't async
* [ ] fix `outline` on `.ReactVirtualized__List`
* [ ] polish actions
  * idiomatic actions (first : launch, second : stop)
  * action name should follow (cf. `shift`)
* [ ] polish `pausableBuffered()` with delay between each value
* [ ] `yapi` & `epyd` error handling
* [x] fix `ffmpeg` synchronous process
  * convert process aren't parallelized because ffmpeg is working on main thread, moreover ui is unreachable during processing
  * solution : implement `ffmpeg` as `web worker`
* [x] virtual loading for performances
  * you can select all before all videos are loaded
  * useless to load all videos if you don't want to edit all id3 tags
  * how ? set total + set state.videos to null data (for scroll item heigh) + get videos on scroll
  * [x] solution : continuous load, display placeholders for unfetched items
* [x] fix `virtualList` (is rendered each time a new item is added)
  * [ ] refacto from `react-virtualized` to `hyperlist` thanks @soyuka
* [ ] polish `containers/videos/capitalize()`
  * specials words : feat, dj, prod
  * cut specials chars : ()...
  * use regex ? (/\w+/ -> capitalize($1))
  * move in `utils`
* [ ] polish `state.analyze` by adding an `error` key
  * and move link analyze outside the component
  * handle `videoId` or `playlistId` error (API errors in short)
* [ ] require `resources` (img, svg...)
  * why ? because it's in the webpack philosophy
  * and (normally), when resource is update, webpack will refresh-it
* [ ] develop server side (universal ? - should be configurable)
  * [x] video download
    * unavailable for client (no CORS on youtube.com)
      * not a good idea, client would need to download large video files for just audio
      * security gap if i use a cors proxy and difficult to filter by url (youtube.com/ytimg.com/googlevideo.com ?)
        * [ ] add a little bit of security like an Ajax header
  * [x] ffmpeg audio extract (if necessary)
    * improve by using `stream`, faster solution, but `ffmpeg.js` may not be the best solution, look at `audiocogs` (`mp4.js` demuxer and `mp3.js`) repositories
      * stream can't be implemented, cause we need to edit id3 tags before zipping
  * [ ] dynamic zip archive
    * is zip necessary ?
      * i can use `saveAs()` foreach video on fly
        * and the user will be asked foreach save.. so, not a good solution
    * show progress ? how in a good ux way ?
      * send zip headers before launching epyd.js handling so progress will be the download itself
        * impossible with `saveAs()`
          * possible with `streamSaver`, but check for polyfill
        * no client zip library available to send data on the fly
          * possible with a webworker ?
        * or i can construct my own `epyd` webworker ?
* [ ] check performances (playlist with 1k videos ? memory ? cpu ? time ?)
  * each part of app
  * yapi `videos` or `playlist`
  * React array push `Video`
  * epyd `process` time (each method, global)
* [ ] make diagrams (cf. [RxJS Github](https://github.com/ReactiveX/rxjs#generating-png-marble-diagrams)) for README.md
* [ ] remove `Aphrodite` and use [react-with-styles](https://github.com/airbnb/react-with-styles)
* [ ] smooth scroll to `.resume` when click on `.landing .search button`
  * necessary ? videos don't shows up instantly
  * yes, but i've a placeholder
* [ ] refacto `utils` folder (aka THE GARBAGE !)
  * [ ] add rxjs operators with `add` strategy
* [ ] rethink responsive design ui
  * make a material version
    * and a customized one
  * [ ] `Badge`
    * shadow on it ?
  * [ ] `Video`
    * be careful about `VirtualList` item height, fixed would be simpler
      * fixed video height for `VirtualList` ?
        * `About` and `Description` on same lines for `width < 810px` ?
  * [ ] fix video placeholder styles
* [ ] logs
* [ ] yaml config
* [ ] on analyze, set unique params (playlist or video id) to url
  * is it React route ?
* [ ] handle initial state params
  * analyze if okay
* [ ] on `epyd.process` error(s), suggest to submit an issue with preseted data
  * algorithm decoding fail for some videos
  * [x] retry too ? (yes, 3 times, thanks RxJS !)
* [ ] find a good ux way to handle thumbnail update from user (url or file)
  * file : drop/down ? and what about copy/paste ?
  * url : ?
* [ ] fix `Heading` texts (polish epyd process : grab, melt, bestest...)
* [ ] clean vendor

## Issues
* [ ] when multiple download occurs at the same time, `Chrome` will only allow first
* [ ] sometimes vidoes can't be downloaded (403)
  * pseudo fix with `retry(3)`
* [ ] `npm` WARN `superagent-rxjs@2.2.2` requires a peer of `superagent@^2.0.0` but none was installed.
  * got `superagent@^3.5.2`

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
* [Logo from iconmonstr](http://iconmonstr.com/sound-wave-1/)
* [Inspiration for logo animation](http://tobiasahlin.com/spinkit/)
* [SVG logo animation](http://codepen.io/anon/pen/ojgwr)
* [Background picture from Amaryllis Liampoti](https://unsplash.com/photos/TDsEBM46YLA)
* [Empty placeholder](https://thenounproject.com)
  * Checkout `/resources/placeholder/*.svg` for artists
