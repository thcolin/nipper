# epyd.js
Epyd (Easy Playlist Youtube Downloadr) vous permet de télécharger vos vidéos et playlists Youtube directement en MP3 avec les tags ID3 remplis correctement (Titre, Artiste, Pochette).

![Image of Epyd](http://i.imgur.com/0VpJD9M.png)

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
// duplicate 'src/config.default.js' to 'src/config.js'
export default {
  // WARNING : security breach, because this code will be executed
  // in user browser, the API Key should not be secured by IP or domain,
  // and so, anyone who would look closely will be able to use it
  apiKey: 'YOUTUBE_API_KEY'
}
```

## Handleable links
Playlist :
```js
var p = /(youtube\.com\/)(watch|playlist)(.*?list=)([^#\&\?\=]{24})/

// youtube.com/watch?v=jmjx1r1omgY&index=1&list=FLj9CxlpVDiacX7ZlzuLuGiQ
// youtube.com/playlist?list=FLj9CxlpVDiacX7ZlzuLuGiQ
```

Video :
```js
var v = /(youtu\.?be(\.com)?\/)(watch|embed|v)?(\/|\?)?(.*?v=)?([^#\&\?\=]{11})/

// youtu.be/gdPpp6X6lGk
// youtube.com/watch?v=gdPpp6X6lGk
// youtube.com/watch?param=true&v=gdPpp6X6lGk
// youtube.com/embed/gdPpp6X6lGk
// youtube.com/v/gdPpp6X6lGk
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
      message: 'Hello World !' // or JSX
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
* text (i18n ?)

## Alternatives
* [VideoGrabby](http://www.videograbby.com/)

## TODO
* handle `gapi` async init
* develop server side
  * video download
  * ffmpeg audio extract (if necessary)
  * dynamic zip archive
* `lineHeight` should be `1.4` on form (even inputs ?) for letters like "g"
* Rename `Video/Snippet` to `Video/Thumbnail`
* fix design for `Safari` (responsive, form button lineHeight)
* handle `videoId` or `playlistId` error
* check performances (playlist with 1k videos ? memory ? cpu ? time ?)
* move styles to container
* test to add a `Badge` shared component to `DownloadSelectionButton`
* remove `Aphrodite` and use [react-with-styles](https://github.com/airbnb/react-with-styles)
* logo animation on mouseOver/touch (svg)
  * like someone playing piano
* smooth scroll to `.resume` when click on `.landing .search button`
* logs
* yaml config
* on analyze, set unique params (playlist or video id) to url
* handle initial state params
  * analyze if okay
* on analyze error, suggest to submit an issue with preseted data
* use CORS to get a playlist or a video directly from the front/client ?
  * https://developer.mozilla.org/fr/docs/HTTP/Access_control_CORS
  * https://developers.google.com/api-client-library/javascript/features/cors
  * https://developers.google.com/identity/protocols/OAuth2UserAgent
  * http://stackoverflow.com/questions/28591788/youtube-api-key-security-how-worried-should-i-be

## Design
* [inVision](https://www.invisionapp.com/)
  * header
  * button
* [Soundy](https://www.soundy.top/sounds/new)
  * button
  * logo animation

## Toolbar
* x/x videos loaded
* toggle all videos
* download selection (x videos)

## Thanks
* https://unsplash.com/photos/TDsEBM46YLA
* http://iconmonstr.com/sound-wave-1/
