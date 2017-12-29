import Rx from 'rxjs/Rx'
import 'utils/rxjs/observable/fromFFMPEG'
import 'utils/rxjs/observable/fromFileReader'
import 'utils/rxjs/observable/fromXHR'
import 'utils/rxjs/operator/delayBetween'
import 'utils/rxjs/operator/retryWithDelay'
import qs from 'qs'
import uuidv4 from 'uuid/v4'
import rescape from 'escape-string-regexp'
import ffmpeg from 'worker-loader?name=ffmpeg.[hash].worker.js!ffmpeg.js/ffmpeg-worker-youtube.js'
import ID3Writer from 'browser-id3-writer'

const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=__ID__&gl=US&hl=en&persist_hl=1&has_verified=1&bpctr=9999999999'
const YTPLAYER_REGEXP = /ytplayer\.config\s+=\s+({.*?});ytplayer/
const CACHE = []

export const CODECS = {
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

const STEPS = {
  default: {
    'download': 0.40,
    'extract': 0.10,
    'convert': 0.49,
    'labelize': 0.01
  },
  effortless: { // is video, audio requested, but same codec as requested
    'download': 0.89,
    'extract': 0.10,
    'labelize': 0.01
  },
  lazy: { // exact same format as requested (dash audio or video)
    'download': 0.99,
    'labelize': 0.01
  }
}

class epyd {
  constructor() {
    this.complete = []

    this.queues = {
      network: {
        observer: new Rx.Subject(),
        limit: 2
      },
      cpu: {
        observer: new Rx.Subject(),
        limit: 1
      }
    }

    for (let queue in this.queues) {
      this.queues[queue].observer
        .filter(job => !this.complete.includes(job.uuid))
        .delayBetween(2000)
        .mergeMap(job => {
          if (this.complete.includes(job.uuid)) {
            return Rx.Observable.empty()
          }

          return job.operation(...job.args)
            .takeWhile(() => !this.complete.includes(job.uuid))
            .catch(err => {
              job.observer.error(err.message)
              return Rx.Observable.empty()
            })
            .do(msg => {
              job.observer.next(msg)

              if (msg.type === 'done') {
                job.observer.complete()
              }
            })
            .takeWhile(msg => msg.type !== 'done')
        }, null, this.queues[queue].limit)
        .subscribe()
    }
  }

  schedule(queue, operation, args) {
    return Rx.Observable.create(observer => {
      const uuid = uuidv4()
      this.queues[queue].observer.next({ uuid, operation, args, observer })
      return () => this.complete.push(uuid)
    })
  }

  proceed(id, codec, tags) {
    const filename = tags.artist + ' - ' + tags.song

    var steps // different according to best fmt and requested codec
    var quality = 256 // min quality for best(), reduced by 64 after each retrieve() try, Youtube can randomly return different amount of fmts

    console.warn('[epyd]', '-', id, '-', '"' + filename + '.' + codec.extension + '"')

    const progress$ = new Rx.Subject()
    const main$ = this.schedule('network', retrieve, [id])
      .map(msg => peel(msg.data.response))
      .map(ytplayer => cast(ytplayer))
      .map(fmts => validate(fmts))
      .map(fmts => best(fmts, codec, { quality: quality }))
      .retryWithDelay(3, 2000, () => quality -= 64)
      .do(fmt => {
        if (fmt.format.acodec.name === codec.name && fmt.format.vcodec !== 'undefined') {
          steps = STEPS.effortless
        } else if (fmt.format.acodec.name === codec.name && fmt.format.vcodec === 'undefined') {
          steps = STEPS.lazy
        } else if (fmt.format.vcodec && fmt.format.vcodec.name === codec.name) {
          steps = STEPS.lazy
        } else {
          steps = STEPS.default
        }
      })
      .mergeMap(fmt => solve(fmt).retry(2))
      .mergeMap(fmt => this.schedule('network', download, [fmt, filename])
        .filter(msg => msg.type !== 'progress' || progress$.next(progress(msg.data, 'download', steps)))
        .mergeMap(msg => !steps.extract ? Rx.Observable.of(msg.data) : this.schedule('cpu', extract, [msg.data, fmt.format.acodec])
          .filter(msg => msg.type !== 'progress' || progress$.next(progress(msg.data, 'extract', steps)))
          .retryWithDelay(1, 0, () => progress$.next(progress(0, 'extract', steps)))
        )
        .mergeMap(msg => !steps.convert ? Rx.Observable.of(msg.data) : this.schedule('cpu', convert, [msg.data, codec])
          .filter(msg => msg.type !== 'progress' || progress$.next(progress(msg.data, 'convert', steps)))
          .retryWithDelay(1, 0, () => progress$.next(progress(0, 'convert', steps)))
        )
        .mergeMap(msg => labelize(msg.data, tags)
          .filter(msg => msg.type !== 'progress' || progress$.next(progress(msg.data, 'labelize', steps)))
          .retryWithDelay(1, 0, () => progress$.next(progress(0, 'labelize', steps)))
        )
        .retryWithDelay(1, 0, () => progress$.next(progress(0, 'download', steps)))
      )
      .catch(error => {
        console.warn('[epyd]', '-', id, '-', error.message)
        throw new Error('Process of **' + id + '** throw an error : `' + (error.message || error) + '`')
      })
      .retryWithDelay(2, 1000, () => progress$.next(progress(0, 'download', steps)))
      .do(null, null, () => progress$.complete())

    return Rx.Observable.merge(main$, progress$.map(progress => ({ type: 'progress', data: progress })))
  }
}

export default new epyd()

function progress(value, current, steps) {
  var total = 0

  for (var key in steps) {
    if (key === current) {
      total += value * steps[key]
      break
    } else {
      total += 100 * steps[key]
    }
  }

  return total
}

function retrieve(id){
  return Rx.Observable.ajax({
      url: YOUTUBE_VIDEO_URL.replace(/__ID__/, id),
      responseType: 'text'
    })
    .map(data => ({ type: 'done', data }))
    .catch(error => {
      throw new Error('Retrieve request failed because of: ' + error.message)
    })
    .timeout(5000)
}

function peel(body){
  if(!YTPLAYER_REGEXP.test(body)){
    // Copyright, +18...
    throw new Error('Object ytplayer.config not found in body')
  }

  return JSON.parse(YTPLAYER_REGEXP.exec(body)[1])
}

function cast(ytplayer){
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

function build(itag, url, asset, s){
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

function validate(fmts){
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

function best(fmts, codec, options = {}){
  const best = fmts
    .filter(fmt => !(codec.type === 'video' && !fmt.format.vcodec))
    .map(fmt => Object.assign(fmt, {
      score: fmt.format.abr - fmt.format.handicap + (32 * (
        fmt.format.acodec.name === codec.name || ((fmt.format.vcodec || {}).name === codec.name)
      ))
    }))
    .sort((a, b) => a.score - b.score)
    .pop()

  if(!best || (options.quality || 0) > best.format.abr){
    throw new Error('Unavailable best fmt for codec "' + codec.name + '"')
  }

  const choosen = best.format[codec.type === 'video' ? 'vcodec' : 'acodec']

  if(codec.name !== choosen.name){
    console.warn('[epyd]', 'Unable to find matching "' + codec.name + '" codec with best abr in Youtube fmts, choose "' + choosen.name + '" over (' + best.format.abr + 'kbps)')
  }

  return best
}

function solve(fmt){
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
    .mergeMap(asset => CACHE[CACHE.indexOf(fmt.asset)] || fetchable)
    .map(expression => Object.assign(fmt, {
      signature: new Function(expression.replace(/__SIGNATURE__/, fmt.s))()
    }))
}

function simplify(body){
  var regexp

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
  regexp = /([\w\$]+)(\.\w+)?\(\w+,.*?\)/g
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
    regexp = new RegExp('(var ' + rescape(dependency) + '=[\\s\\S]*?\});')
    if(!regexp.test(body)){
      throw new Error('Helper var "' + dependency + '" not found')
    }
    helpers.push(regexp.exec(body)[1])
  })

  // executor
  var executor = 'return ' + decryptor + '("__SIGNATURE__")'

  return [...helpers, algorithm, executor].join('; ') + ';'
}

function download(fmt, filename){
  // hope Rx.Observable.ajax() progressSubject will support download soon...
  // see rxjs issues #2428 and #2553
  const progress$ = new Rx.Subject()
  const download$ = Rx.Observable.fromXHR(
      'GET',
      fmt.url + (fmt.signature ? '&signature=' + fmt.signature : ''),
      Object.assign(new XMLHttpRequest(), {
        responseType: 'arraybuffer',
        onprogress: e => progress$.next({
          type: 'progress',
          data: Math.floor((e.loaded / e.total) * 100)
        })
      })
    )
    .map(data => {
      progress$.complete()

      return {
        type: 'done',
        data: new File(
          [data.response],
          filename + '.' + data.getResponseHeader('content-type').split('/').pop(), { type: data.getResponseHeader('content-type') }
        )
      }
    })
    .catch(error => {
      progress$.complete()
      throw new Error('Download request failed because of ' + error) // (string) xhr.statusText
    })

  return Rx.Observable.merge(progress$, download$)
}

function transcode(name, file, codec, options){
  var input = 'input.' + file.name.split('.').pop()
  var output = file.name.split('.').slice(0, -1).concat([codec.extension]).join('.')

  return Rx.Observable
    .fromFileReader(file)
    .map(buffer => ({
      name: name,
      type: 'run',
      MEMFS: [{name: input, data: buffer}],
      stdin: null,
      arguments: [
        '-i', input
      ].concat(options).concat(codec.options || []).concat(['output.' + codec.extension])
    }))
    .mergeMap(job => Rx.Observable
      .fromFFMPEG(ffmpeg, job)
      .mergeMap(msg => msg.type !== 'done' ? Rx.Observable.of(msg) : Rx.Observable.of(msg.data)
        .map(result => result.MEMFS[0])
        .mergeMap(out => typeof out.data !== 'undefined' ? Rx.Observable.of(out) : Rx.Observable.throw())
        .map(out => Buffer(out.data))
        .map(buffer => new File([buffer], output, {type: 'audio/' + codec.name}))
        .map(file => ({ type: 'done', data: file }))
      )
    )
    .catch(error => {
      throw new Error('Unexpected behavior during ffmpeg transcode (' + name + ') from ' + file.type + ' to audio/' + codec.name)
    })
}

function extract(file, codec){
  return transcode('extract', file, codec, [
    '-vn',
    '-c:a', 'copy'
  ])
}

function convert(file, codec){
  return transcode('convert', file, codec, [
    '-c:a', codec.library
  ])
}

function labelize(file, tags){
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
            .mergeMap(buffer => Rx.Observable.from([
              { type: 'progress', data: 100 },
              { type: 'done', data: new File([buffer], file.name, {type: file.type}) }
            ]))
        // else (audio) simply run ffmpeg !
        case 'audio/aac':
        case 'audio/vorbis':
        case 'audio/opus':
          console.warn('[epyd]', 'Unable to illustrate "' + file.name + '" with MIME type ' + file.type)

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

          return Rx.Observable.fromFFMPEG(ffmpeg, job)
            .mergeMap(msg => msg.type !== 'done' ? Rx.Observable.of(msg) : Rx.Observable.of(msg.data)
              .map(result => result.MEMFS[0])
              .mergeMap(out => typeof out.data !== 'undefined' ? Rx.Observable.of(out) : Rx.Observable.throw())
              .map(out => Buffer(out.data))
              .map(buffer => new File([buffer], file.name, {type: file.type}))
              .map(file => msg.assign({ data: file }))
            )
        // else (video)
        default:
          return Rx.Observable.of(buffer)
            .mergeMap(buffer => Rx.Observable.from([
              { type: 'progress', data: 100 },
              { type: 'done', data: new File([buffer], file.name, {type: file.type}) }
            ]))
      }
    })
    .catch(error => {
      throw new Error('Unexpected behavior during labelizing of ' + file.type)
    })
}
