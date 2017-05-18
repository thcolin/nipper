# epyd.js

![epyd.js - Landing](http://i.imgur.com/0lH1zEa.jpg)
![epyd.js - Toolbar](http://i.imgur.com/en4fzXY.png)
![epyd.js - Empty Placholder](http://i.imgur.com/K5eU6Uq.png)
![epyd.js - List](http://i.imgur.com/bXCDXna.png)

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
    entities: {
      1: {
        id: 1,
        origin: 'state',
        children: 'Hello World !', // or simply JSX !
        closed: false
      }
    },
    result: [1]
  },
  videos: {
    entities: {
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
    },
    result: ['Y2vVjlT306s']
  }
}
```

## Customize
These should be configurable (maybe in `config.js` ? Or just document it) :
* Background image
* Colors

## TODO
* [ ] EVERY STEP FROM [froots/normalizr-example](https://github.com/froots/normalizr-example)
  * [ ] https with [Let's Encrypt](https://letsencrypt.org/)
* [ ] AND STEPS FROM [tonyhb/redux-without-profanity](https://tonyhb.gitbooks.io/redux-without-profanity/) TOO !

### Features
* [ ] on `processSubject`, set unique params (playlist or video id, or just #id ?) to url
  * is it React route ? - no, too complicated for just one page
  * [ ] handle initial state params
    * run a `processSubject` on init (`src/index.js` maybe ?)
* [ ] show illustration
  * on `ListVideo` if only placeholders rendered
    * or if no video at all (error for wrong video ID)
  * add delay on analyze
  * smooth scroll to `.resume` when click on `.landing .search button`
* [ ] add close button in `Landing` which reset `state.context`
* [ ] allow download format choice
  * mp3 @192kbps, aac, ac3, original video...
  * ui/ux cf. [Daily UI #027 - Dropdown by Fi](https://dribbble.com/shots/3278515-Daily-UI-027-Dropdown)
    * global dropdown on `Landing`
      * `fa-bolt`, `fa-lightbulb-o`, `fa-magic`, `fa-rocket`, `fa-sliders`, `fa-cog`, `fa-random`
      * avoid, discutable ux : the user should make his choice on `Landing` to download on `Video` item
    * on `downloadVideo` and `downloadVideos` buttons (left, divided by a white separator)
      * `fa-volume-up`, `fa-film`
* [ ] error handling
  * [ ] `yapi`
    * handle `videoId` or `playlistId` error (API errors in short)
  * [x] `epyd`
  * [x] polish `state.analyze` by adding an `error` key
    * and move link analyze outside the component

### Refactoring
* [ ] refacto from `react-virtualized` to `hyperlist` thanks @soyuka

### Polish
* [ ] `error.origin = 'landing'` is not valid, `landing` isn't a valid origin, it should be `context`
  * be how to filter errors from analyze ? or for landing ?
* [ ] ready props of `Form` should be set from `FormAnalyst`
* [ ] fix `outline` on `.ReactVirtualized__List`
* [ ] add rxjs operators with `add` strategy
  * delete `import` on `index.js`
* [ ] use `immutable.js` and `normalizr` to normalize state shape ?
  * [Redux Documentation about Immutable](http://redux.js.org/docs/recipes/UsingImmutableJS.html)
  * implement `Error` and `Video` records [records](https://facebook.github.io/immutable-js/docs/#/Record)
* [ ] simplify `mapStateToProps` of `containers`
  * [ ] `ButtonDownloadVideos` should display `Done` when `progress` is `100`
  * [ ] use [react/reselect](https://github.com/reactjs/reselect) ?
* [ ] polish `yapi.playlist` flusher
* [ ] refacto `epyd` main function (mainly progress behavior) like `Rx.Observable.ajax` maybe ?
  * current solution is quite good, no ?
* [ ] animate `epyd.progress$` with `animation-delay`
* [ ] remove `Aphrodite` and use [react-with-styles](https://github.com/airbnb/react-with-styles)
* [ ] `server.js` should catch errors
  * like connection errors

### Issues
* [ ] sometimes vidoes can't be downloaded (403)
  * [x] pseudo fix with `retry(3)`
  * should inspect

### Style
* [ ] refacto `context` error, it seems fake
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
* [ ] find a good ux way to handle thumbnail update from user (url or file)
  * file : drop/down ? and what about copy/paste ?
  * url : ?
    * mobile double touch (one, display an overlay for file or link, second close it)

### Miscellaneous
* [ ] polish `Heading` texts (epyd process)
* [ ] require `resources` (img, svg...)
  * why ? because it's in the webpack philosophy
  * and (normally), when resource is update, webpack will refresh-it
* [ ] make universal ?
  * [ ] look at [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/)
* [ ] check performances (playlist with 1k videos ? memory ? cpu ? time ?)
  * each part of app
  * yapi `videos` or `playlist`
  * React array push `Video`
  * epyd `process` time (each method, global)
* [ ] documentate project
  * [ ] diagrams (cf. [RxJS Github](https://github.com/ReactiveX/rxjs#generating-png-marble-diagrams)) for README.md
  * [x] objects shapes - if standardized with `immutable.js` (`Error` and `Video`)
* [ ] logs
* [ ] `yaml` config
  * current `javascript object`, is it good ?
    * people can mess up

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
