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
```javascript
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
```javascript
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
```javascript
{
  context: {
    total: 10, // default null
    pause: false,
    downloading: false
  },
  errors: {
    1: {
      id: 1,
      children: 'Hello World !' // or simply JSX !
    }
  },
  videos: {
    'Y2vVjlT306s': {
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
  }
}
```

## Customize
* background image
* colors

## TODO
* [ ] add close button in `Landing` which reset `state.context`
* [ ] smooth scroll to `.resume` when click on `.landing .search button`
  * necessary ? videos don't shows up instantly
  * yes, but i've an illustration
* [ ] simplify `mapStateToProps` of `containers`
  * [ ] `ButtonDownloadVideos` should display `Done` when `progress` is `100`
  * [ ] make a `keys` state for `videos` and `errors`
    * avoid `Object.keys(state.videos).map(id => state.videos[id])` on containers
* [ ] refacto `epyd` main function (mainly progress behavior) like `Rx.Observable.ajax` maybe ?
* [ ] fix `analyze` re-render issue
* [ ] slow down `epyd.progress$`
  * use `sampleTime` for rxjs
  * and `animation-delay` for style
* [ ] fix `outline` on `.ReactVirtualized__List`
* [ ] polish `pausableBuffered()` with delay between each value
* [ ] `yapi` & `epyd` error handling
  * on `ducks` specially
  * use `errorsDuck.includeError()`
  * [ ] refacto context.processAnalyzeEpic error handling
    * use Error Object, and test `typeof data === 'object' && data.constructor.name === 'Error'`
    * or use an rxjs operator ?
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
* [ ] make universal ?
* [ ] check performances (playlist with 1k videos ? memory ? cpu ? time ?)
  * each part of app
  * yapi `videos` or `playlist`
  * React array push `Video`
  * epyd `process` time (each method, global)
* [ ] make diagrams (cf. [RxJS Github](https://github.com/ReactiveX/rxjs#generating-png-marble-diagrams)) for README.md
* [ ] remove `Aphrodite` and use [react-with-styles](https://github.com/airbnb/react-with-styles)
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
* [ ] `yaml` config
  * current `javascript object`, is it good ?
    * people can mess up
* [ ] on analyze, set unique params (playlist or video id, or just #id ?) to url
  * is it React route ?
* [ ] handle initial state params
  * `processAnalyze` (when refactored)
* [ ] on `epyd` error(s), suggest to submit an issue with preseted data
  * algorithm decoding can fail for some videos
  * [x] retry too ? (yes, 3 times, thanks RxJS !)
* [ ] find a good ux way to handle thumbnail update from user (url or file)
  * file : drop/down ? and what about copy/paste ?
  * url : ?
    * mobile double touch (one, display an overlay for file or link, second close it)
* [ ] polish `Heading` texts (epyd process : grab, melt, bestest...)

## Issues
* [ ] sometimes vidoes can't be downloaded (403)
  * pseudo fix with `retry(3)`
  * should inspect

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
