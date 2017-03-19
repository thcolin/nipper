# epyd.js
Epyd (Easy Playlist Youtube Downloadr) vous permet de télécharger vos vidéos et playlists Youtube directement en MP3 avec les tags ID3 remplis correctement (Titre, Artiste, Pochette).

![epyd.js - Landing](http://i.imgur.com/0lH1zEa.jpg)
![epyd.js - List](http://i.imgur.com/FbWsNEh.png)

## Tags ID3
* La pochette est définis par le Thumbnail de la vidéo
* L'artiste (Si le titre de la vidéo est au format "Artiste * Titre")
* Le titre (Toujours pareil, si le titre est au format "Artiste * Titre")

## Utilisation
Vous pouvez au choix, télécharger juste une vidéo au format MP3, ou en sélectionner plusieurs (si vous checkez une playlist par exemple) et télécharger un zip de toutes ces vidéos en MP3.

## Prérequis
* [avconv / ffmpeg](https://libav.org/download/)

## Config
```js
// move or duplicate `src/config.default.js` to `src/config.js`
export default {
  // WARNING : security breach, because this code will be executed
  // in user browser, the API Key should not be secured by IP or domain,
  // and so, anyone who would look closely will be able to use it
  apiKey: 'YOUTUBE_API_KEY'
}
```

## Handleable links
```js
/* PLAYLIST :
  youtube.com/watch?v=jmjx1r1omgY&index=1&list=FLj9CxlpVDiacX7ZlzuLuGiQ
  youtube.com/playlist?list=FLj9CxlpVDiacX7ZlzuLuGiQ
*/
var p = /(youtube\.com\/)(watch|playlist)(.*?list=)([^#\&\?\=]{24})/

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
  analyze: {
    id: 'FLj9CxlpVDiacX7ZlzuLuGiQ', // defaul null
    kind: 'p', // default null
    pause: false,
    total: 10, // default null
    token: 'CAUQAA' // default null
  },
  errors: [
    {
      id: 1,
      message: 'Hello World !' // or simply JSX !
    }
  ],
  videos: [
    {
      id: 'Y2vVjlT306s',
      selected: false,
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
        title: 'Hello',
        artist: 'World'
      }
    }
  ]
}
```

## Customize
* background image
* colors

## TODO
* develop server side
  * video download
  * ffmpeg audio extract (if necessary)
  * dynamic zip archive
* `lineHeight` should be `1.4` on form (even inputs ?) for letters like "g"
* fix design for `Safari` (responsive, form button lineHeight)
* handle `videoId` or `playlistId` error
* handle empty playlist
* check performances (playlist with 1k videos ? memory ? cpu ? time ?)
* move more styles possible to containers
* remove `Aphrodite` and use [react-with-styles](https://github.com/airbnb/react-with-styles)
* smooth scroll to `.resume` when click on `.landing .search button`
* logs
* yaml config
* on analyze, set unique params (playlist or video id) to url
* handle initial state params
  * analyze if okay
* on analyze error, suggest to submit an issue with preseted data
* find a good UX way to handle thumbnail update from user (url or file)
  * file : drop/down ? and what about copy/paste ?
  * url : ?

## Design
* [inVision](https://www.invisionapp.com/)
  * header
  * button
* [Soundy](https://www.soundy.top/sounds/new)
  * button
  * logo animation

## Alternatives
* [VideoGrabby](http://www.videograbby.com/)

## Thanks
* [Logo](http://iconmonstr.com/sound-wave-1/)
* [Logo animation inspiration](http://tobiasahlin.com/spinkit/)
* [SVG Logo animation](http://codepen.io/anon/pen/ojgwr)
* [Background picture](https://unsplash.com/photos/TDsEBM46YLA)
