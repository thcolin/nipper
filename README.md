# epyd.js
Epyd (Easy Playlist Youtube Downloadr) vous permet de télécharger vos vidéos et playlists Youtube directement en MP3 avec les tags ID3 remplis correctement (Titre, Artiste, Pochette).

![Image of Epyd](http://i.imgur.com/0VpJD9M.png)

## Tags ID3
* La pochette est définis par le Thumbnail de la vidéo
* L'artiste (Si le titre de la vidéo est au format "Artiste * Titre")
* Le titre (Toujours pareil, si le titre est au format "Artiste * Titre")

## Utilisation
Vous pouvez au choix, télécharger juste une vidéo au format MP3, ou en sélectionner plusieurs (si vous checkez une playlist par exemple) et télécharger un zip de toutes ces vidéos en MP3.

## Configuration
Créer un fichier `/app/vars.php` :
```
<?php

  define('YOUTUBE_KEY', "Votre clé API Youtube");
  define('FFMPEG_BIN', '/usr/bin/ffmpeg');
  define('FFPROBE_BIN', '/usr/bin/ffprobe');

?>
```

## Prérequis
* [avconv / ffmpeg](https://libav.org/download/)

## Customize
* background image
* colors
* text (i18n)

## TODO
* logo animation on mouseOver/touch (svg)
  * like someone playing piano
* smooth scroll to `.resume` when click on `.landing .search button`
* logs
* yaml config
* on analyze, set unique params (playlist or video id) to url
* handle initial state params
  * analyze if okay
* on analyze error, suggest to submit an issue with preseted data
* refacto parallax with a vanilla js lib
* show used quality foreach video
* download video ?
* use CORS to get a playlist or a video directly from the front/client ?
  * https://developer.mozilla.org/fr/docs/HTTP/Access_control_CORS
  * https://developers.google.com/api-client-library/javascript/features/cors

## Thanks
* https://unsplash.com/photos/TDsEBM46YLA
* http://iconmonstr.com/sound-wave-1/
