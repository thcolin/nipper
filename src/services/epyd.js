import Rx from 'rxjs/Rx'
import qs from 'qs'
import rescape from 'escape-string-regexp'
import ffmpeg from 'worker-loader!ffmpeg.js/ffmpeg-worker-youtube.js'
import ID3Writer from 'browser-id3-writer'

const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=__ID__&gl=US&hl=en&persist_hl=1'
const YTPLAYER_REGEXP = /ytplayer\.config\s+=\s+({.*?});ytplayer/
const CACHE = []

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

export default function epyd(id, to, tags){
  const codec = CODECS[to]
  const filename = tags.artist + ' - ' + tags.song

  console.log('[epyd]', id, filename, codec, tags)

  var lazy = !codec.library // no ffmpeg transcode
  var effortless = false // if downloaded file got same audio codec as expected
  var weight = 1 // different foreach steps of main$ process : download() take much longer than labelize()
  var limit = 256 // beginning limit for best(), reduced by 64 after each try, each Youtube grab can return different amount of fmts

  const progress$ = new Rx.Subject()
    .scan((accumulator, current) => {
      accumulator[0] = (accumulator[1] === 100 ? 0 : accumulator[1])
      accumulator[1] = current
      return accumulator
    }, [0, 0])
    .map(values => values[1] - values[0])
    .map(diff => diff * weight)
    .scan((accumulator, diff) => accumulator + diff, 0)
    .map(value => Math.round(value))

  const main$ = Rx.Observable.ajax({
      url: YOUTUBE_VIDEO_URL.replace(/__ID__/, id),
      responseType: 'text'
    })
    .catch(error => {
      throw new Error('Grab request failed because of ' + error.message)
    })
    .timeout(3000)
    .map(data => data.response)
    .map(body => peel(body))
    .map(ytplayer => cast(ytplayer))
    .map(fmts => validate(fmts))
    .map(fmts => best(fmts, codec, { limit: limit }))
    .retryWithDelay(3, 2000, () => limit -= 64)
    .do(fmt => effortless = (fmt.format.acodec === codec))
    .mergeMap(fmt => solve(fmt).retry(2))
    .do(() => weight = (lazy ? 0.9 : 0.4))
    .mergeMap(fmt => download(fmt, filename, progress$)
      .do(() => weight = (effortless ? 0.4 : 0.1))
      .mergeMap(file => lazy ? Rx.Observable.of(file) : extract(file, fmt.format.acodec, progress$).retry(1))
      .do(() => weight = 0.4)
      .mergeMap(file => lazy || effortless ? Rx.Observable.of(file) : convert(file, codec, progress$).retry(1))
      .do(() => weight = 0.1)
      .mergeMap(file => lazy ? Rx.Observable.of(file) : labelize(file, tags, progress$).retry(1))
      .retry(1)
    )
    .catch(error => {
      console.warn('[epyd]', error)
      throw new Error('Process of **' + id + '** throw an error : `' + (error.message || error) + '`')
    })
    .retryWithDelay(2, 1000)

  return Rx.Observable.merge(main$, progress$)
}

export function peel(body){
  if(!YTPLAYER_REGEXP.test(body)){
    // Copyright, +18...
    throw new Error('Object ytplayer.config not found in body')
  }

  return JSON.parse(YTPLAYER_REGEXP.exec(body)[1])
}

export function cast(ytplayer){
  return ['url_encoded_fmt_stream_map', 'adaptive_fmts']
    .map(key => ytplayer.args[key] || undefined)
    .filter(fmts => typeof fmts !== 'undefined')
    .map(fmts => qs.parse(fmts))
    .filter(fmts => Array.isArray(fmts.itag))
    .map(fmts => (Array.isArray(fmts.url) ? fmts.url : [fmts.url])
      .map((url, index) => build(
        parseInt(url.match(/itag=(\d+)/)[1] || 0), // itag
        (Array.isArray(fmts.url) ? fmts.url[index] : fmts.url).split(',')[0], // url
        ytplayer.assets.js, // asset
        (Array.isArray(fmts.s) ? fmts.s[index] : fmts.s) || url.match(/s=([\.a-zA-Z0-9])+/)[1] || null // s
      ))
      .filter(fmt => fmt)
    )
    .reduce((accumulator, current) => accumulator.concat(current), [])
}

export function build(itag, url, asset, s){
  if(!itag){
    return null
  }

  var out = {
    itag: itag,
    format: null,
    score: 0,
    url: url,
    asset: asset,
    s: s,
    signature: null
  }

  // handicap strategy : lighten file is better
  out.format = ((itag) => {
    switch(itag){
      // standard videos
      case 17: return {'acodec': CODECS['aac'], 'vcodec': null, 'abr': 24, 'handicap': 1}
      case 18: return {'acodec': CODECS['aac'], 'vcodec': CODECS['mp4'], 'abr': 96, 'handicap': 2}
      case 22: return {'acodec': CODECS['aac'], 'vcodec': CODECS['mp4'], 'abr': 192, 'handicap': 4}
      case 37: return {'acodec': CODECS['aac'], 'vcodec': CODECS['mp4'], 'abr': 192, 'handicap': 5}
      case 38: return {'acodec': CODECS['aac'], 'vcodec': CODECS['mp4'], 'abr': 192, 'handicap': 6}
      case 43: return {'acodec': CODECS['vorbis'], 'vcodec': CODECS['webm'], 'abr': 128, 'handicap': 2}
      case 44: return {'acodec': CODECS['vorbis'], 'vcodec': CODECS['webm'], 'abr': 128, 'handicap': 3}
      case 45: return {'acodec': CODECS['vorbis'], 'vcodec': CODECS['webm'], 'abr': 192, 'handicap': 4}
      case 46: return {'acodec': CODECS['vorbis'], 'vcodec': CODECS['webm'], 'abr': 192, 'handicap': 5}
      case 59: return {'acodec': CODECS['aac'], 'vcodec': CODECS['mp4'], 'abr': 128, 'handicap': 3}
      case 78: return {'acodec': CODECS['aac'], 'vcodec': CODECS['mp4'], 'abr': 128, 'handicap': 3}

      // dash mp4 aac audio
      case 139: return {'acodec': CODECS['aac'], 'abr': 48, 'handicap': 0}
      case 140: return {'acodec': CODECS['aac'], 'abr': 128, 'handicap': 0}
      case 141: return {'acodec': CODECS['aac'], 'abr': 256, 'handicap': 0}

      // dash webm vorbis audio
      case 171: return {'acodec': CODECS['vorbis'], 'abr': 128, 'handicap': 0}
      case 172: return {'acodec': CODECS['vorbis'], 'abr': 256, 'handicap': 0}

      // dash webm opus audio
      case 249: return {'acodec': CODECS['opus'], 'abr': 50, 'handicap': 0}
      case 250: return {'acodec': CODECS['opus'], 'abr': 70, 'handicap': 0}
      case 251: return {'acodec': CODECS['opus'], 'abr': 160, 'handicap': 0}
    }
  })(itag)

  return out
}

export function validate(fmts){
  var filtered = fmts.filter(fmt => [
    // standard videos
    17, 18, 22, 37, 38, 43, 44, 45, 46, 59, 78,
    // dash mp4 aac audio
    139, 140, 141,
    // dash webm vorbis audio
    171, 172,
    // dash webm opus audio
    249, 250, 251
  ].includes(fmt.itag))

  if(!filtered.length){
    throw new Error('No suitable fmt')
  }

  return filtered
}

export function best(fmts, codec, options = {}){
  const best = fmts
    .filter(fmt => !(codec.type === 'video' && !fmt.format.vcodec))
    .map(fmt => Object.assign(fmt, {
      score: fmt.format.abr - fmt.format.handicap + (32 * (
        fmt.format.acodec.name === codec.name || ((fmt.format.vcodec || {}).name === codec.name)
      ))
    }))
    .sort((a, b) => a.score - b.score)
    .pop()

  if(!best || (options.limit || 0) > best.format.abr){
    throw new Error('Unavailable best fmt for codec "' + codec.name + '"')
  }

  const choosen = best.format[codec.type === 'video' ? 'vcodec' : 'acodec']

  if(codec.name !== choosen.name){
    console.warn('Unable to find matching "' + codec.name + '" codec with best abr in Youtube fmts, choose "' + choosen.name + '" over (' + best.format.abr + 'kbps)')
  }

  return best
}

export function solve(fmt){
  if(fmt.s === null){
    return Rx.Observable.of(fmt)
  }

  var fetchable = Rx.Observable.ajax({
      url: 'https://www.youtube.com' + fmt.asset,
      responseType: 'text'
    })
    .catch(error => {
      throw new Error('Solve request failed because of ' + error.message) // (string) xhr.statusText
    })
    .map(data => data.response)
    .map(body => simplify(body))
    .do(expression => CACHE.push(expression))

  return Rx.Observable.of(fmt.asset)
    .switchMap(asset => CACHE[CACHE.indexOf(fmt.asset)] || fetchable)
    .map(expression => Object.assign(fmt, {
      signature: new Function(expression.replace(/__SIGNATURE__/, fmt.s))()
    }))
}

export function simplify(body){
  let regexp

  // decryptor (function name)
  regexp = /(["|']signature["|'],|.sig\|\|)([\w$]+)\(/
  if(!regexp.test(body)){
    throw new Error('Decryptor function name not found')
  }
  var decryptor = regexp.exec(body)[2]

  // algorithm (function)
  regexp = new RegExp('(' + rescape(decryptor) + '=function\\([a-zA-Z]+\\){.*?});')
  if(!regexp.test(body)){
    throw new Error('Algorithm function "' + decryptor + '" not found')
  }
  var algorithm = regexp.exec(body)[1]

  // dependencies (function names)
  regexp = /(\w+)(\.\w+)?\(\w+,.*?\)/g
  var dependencies = []
  var matches = []

  while(matches = regexp.exec(algorithm)){
    if(!dependencies.includes(matches[1])){
      dependencies.push(matches[1])
    }
  }

  // helper (var/function?)
  var helpers = []
  dependencies.forEach(dependency => {
    regexp = new RegExp('(var ' + rescape(dependency) + '=[\\s\\S]*?);var')
    if(!regexp.test(body)){
      throw new Error('Helper var "' + dependency + '" not found')
    }
    helpers.push(regexp.exec(body)[1])
  })

  // executor
  var executor = 'return ' + decryptor + '("__SIGNATURE__")'

  return [...helpers, algorithm, executor].join('; ') + ';'
}

export function download(fmt, filename, progress$){
  // hope Rx.Observable.ajax() progressSubject will support download soon...
  // see rxjs issues #2428 and #2553
  return Rx.Observable.fromXHR(
      'GET',
      fmt.url + (fmt.signature ? '&signature=' + fmt.signature : ''),
      Object.assign(new XMLHttpRequest(), {
        responseType: 'arraybuffer',
        onprogress: e => progress$.next(Math.floor((e.loaded / e.total) * 100))
      })
    )
    .catch(error => {
      throw new Error('Download request failed because of ' + error) // (string) xhr.statusText
    })
    .map(data => new File(
      [data.response],
      filename + '.' + data.getResponseHeader('content-type').split('/').pop(), {type: data.getResponseHeader('content-type')})
    )
}

export function transcode(name, file, codec, options, progress$){
  var out = file.name.split(/\.+/).slice(0, -1).concat([codec.extension]).join('.')

  return Rx.Observable
    .fromFileReader(file)
    .map(buffer => ({
      name: name,
      type: 'run',
      MEMFS: [{name: file.name, data: buffer}],
      stdin: null,
      arguments: [
        '-i', file.name
      ].concat(options).concat(codec.options || []).concat([out])
    }))
    .mergeMap(job => Rx.Observable.fromFFMPEG(ffmpeg, job, progress$))
    .map(result => result.MEMFS[0])
    .mergeMap(out => typeof out.data !== 'undefined' ? Rx.Observable.of(out) : Rx.Observable.throw())
    .map(out => Buffer(out.data))
    .map(buffer => new File([buffer], out, {type: 'audio/' + codec.name}))
    .catch(error => {
      throw new Error('Unexpected behavior during ffmpeg transcode (' + name + ') from ' + file.name.type + ' to audio/' + codec.name)
    })
}

export function extract(file, codec, progress$){
  return transcode('extract', file, codec, [
    '-vn',
    '-c:a', 'copy'
  ], progress$)
}

export function convert(file, codec, progress$){
  return transcode('convert', file, codec, [
    '-c:a', codec.library
  ], progress$)
}

export function labelize(file, tags, progress$){
  return Rx.Observable
    .fromFileReader(file)
    .mergeMap(buffer => {
      switch(file.type){
        // only ID3Writer is able to apply cover art
        case 'audio/mp3':
          return Rx.Observable
            .of(new ID3Writer(buffer))
            .mergeMap(writer => Rx.Observable.fromFileReader(tags.cover)
              .do(cover => writer
                .setFrame('TIT2', tags.song)
                .setFrame('TPE1', [tags.artist])
                .setFrame('APIC', {
                  type: 3,
                  data: cover,
                  description: 'Youtube thumbnail'
                })
                .addTag()
              )
              .map(() => Buffer.from(writer.arrayBuffer))
            )
            .do(() => progress$.next(100))
        // else (audio) simply run ffmpeg !
        case 'audio/aac':
        case 'audio/vorbis':
        case 'audio/opus':
          console.warn('Unable to illustrate MIME type ' + file.type)

          var codec = CODECS[file.type.split('/')[1]]
          var out = file.name.split(/\.+/).slice(0, -1).concat(['tagged', codec.extension]).join('.')
          var job = {
            type: 'run',
            MEMFS: [{name: file.name, data: buffer}],
            stdin: null,
            arguments: [
              '-i', file.name,
              '-c:a', 'copy',
              '-metadata', 'artist=' + tags.artist + '',
              '-metadata', 'title=' + tags.song + ''
            ].concat(codec.options || []).concat([out])
          }

          return Rx.Observable.fromFFMPEG(ffmpeg, job, progress$)
            .map(result => result.MEMFS[0])
            .mergeMap(out => typeof out.data !== 'undefined' ? Rx.Observable.of(out) : Rx.Observable.throw())
            .map(out => Buffer(out.data))
        // else (video)
        default:
          return Rx.Observable.of(buffer)
            .do(() => progress$.next(100))
      }
    })
    .map(buffer => new File([buffer], file.name, {type: file.type}))
    .catch(error => {
      throw new Error('Unexpected behavior during labelizing of ' + file.type)
    })
}
