import Rx from 'rxjs/Rx'
import qs from 'qs'
import rescape from 'escape-string-regexp'
// import ffmpeg from 'ffmpeg.js/ffmpeg-mp4.js'
import fworker from 'worker-loader!ffmpeg.js/ffmpeg-worker-mp4.js'
import ID3Writer from 'browser-id3-writer'
import moment from 'moment'

const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=__ID__&gl=US&hl=en&persist_hl=1'
const YTPLAYER_REGEXP = /ytplayer\.config\s+=\s+({.*?});ytplayer/

/* STRATEGY :
  - highest abr (@) is goal
  - audio only is better (lighter files), fallback to video
  - aac is better (faster conversion to mp3 ?), fallback to vorbis
 */
const QUALITIES = [
  18,  // mp4   360p   aac@96
  43,  // webm  480p   vorbis@128
  44,  // webm  360p   vorbis@128
  78,  // mp4   480p   aac@128
  59,  // mp4   480p   aac@128
  171, // webm  audio  vorbis@128
  140, // mp4   audio  aac@128
  46,  // webm  1080p  vorbis@192
  45,  // webm  720p   vorbis@192
  37,  // mp4   1080p  aac@192
  22,  // mp4   720p   aac@192
  172, // webm  audio  vorbis@256
  141, // mp4   audio  aac@256
]

// cache for solve() which request() for a video JS asset
const EXPRESSIONS = []

// initial options
const INITIAL = {
  workize: true,
  progress: true,
  retry: 3
}

// monitored methods (progress)
const MONITOR = ['download', 'convert']

export default (id, id3, options = {}) => {
  options = Object.assign(INITIAL, options)

  const filename = id3.artist + ' - ' + id3.song

  const progress$ = new Rx.Subject()
    .filter(() => options.progress)
    .filter(progress => MONITOR.indexOf(progress.type) !== -1)
    .map(progress => Math.round((progress.value / MONITOR.length) + (MONITOR.indexOf(progress.type) * (100 / MONITOR.length))))

  const file$ = Rx.Observable.ajax({
      url: YOUTUBE_VIDEO_URL.replace(/__ID__/, id),
      responseType: 'text'
    })
    .catch(error => {
      throw new Error('Grab request failed because of ' + error.message) // (string) xhr.statusText
    })
    .timeout(3000)
    .map(data => data.response)
    .map(body => peel(body))
    .map(ytplayer => cast(ytplayer))
    .map(fmts => validate(fmts))
    // should be retryDelay(attemps, ms)
    .retryWhen(errors => errors.scan((count, error) => {
      if(count >= options.retry){
        throw error
      }

      return count + 1
    }, 0).delay(2000))
    .concatAll()
    .reduce(best)
    .mergeMap(fmt => solve(fmt).retry(options.retry)) // merge: need to request() asset
    .mergeMap(fmt => download(fmt, filename, progress$).retry(options.retry))
    .mergeMap(file => convert(file, progress$, options.workize).retry(options.retry)) // merge: read File as array buffer
    .mergeMap(file => labelize(file, id3).retry(options.retry))
    .catch(error => {
      console.warn('epyd', error)
      throw new Error('Process of **' + id + '** throw an error : `' + (error.message || error) + '`')
    })
    .retryWhen(errors => errors.scan((count, error) => {
      if(count >= options.retry){
        throw error
      }

      return count + 1
    }, 0).delay(1000))

  return {
    progress: progress$,
    file: file$
  }
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
      .map((url, index) => ({
        itag: parseInt(url.match(/itag=(\d+)/)[1] || 0),
        url: (Array.isArray(fmts.url) ? fmts.url[index] : fmts.url).split(',')[0],
        asset: ytplayer.assets.js,
        s: (Array.isArray(fmts.s) ? fmts.s[index] : fmts.s) || url.match(/s=([\.a-zA-Z0-9])+/)[1] || null
      }))
      .filter(fmt => fmt.itag > 0)
    )
    .reduce((accumulator, current) => accumulator.concat(current), [])
}

export function validate(fmts){
  if(!fmts.filter(fmt => ~QUALITIES.indexOf(fmt.itag)).length){
    throw new Error('No suitable fmt')
  }

  return fmts
}

export function best(accumulator, fmt){
  return QUALITIES.indexOf(fmt.itag) >= QUALITIES.indexOf(accumulator.itag) ? fmt : accumulator
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
    .do(expression => EXPRESSIONS.push(expression))

  return Rx.Observable.of(fmt.asset)
    .switchMap(asset => EXPRESSIONS[EXPRESSIONS.indexOf(fmt.asset)] || fetchable)
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
    if(!~dependencies.indexOf(matches[1])){
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
  // hope Rx.Observable.ajax() progressSubject wiil support download soon...
  // see rxjs issues #2428 and #2553
  return Rx.Observable.fromXHR(
      'GET',
      fmt.url + (fmt.signature ? '&signature=' + fmt.signature : ''),
      Object.assign(new XMLHttpRequest(), {
        responseType: 'arraybuffer',
        onprogress: e => progress$.next({
          type: 'download',
          value: Math.floor((e.loaded / e.total) * 100)
        })
      })
    )
    .catch(message => {
      throw new Error('Download request failed because of ' + message) // (string) xhr.statusText
    })
    .map(data => new File([data.response], filename + '.' + data.getResponseHeader('content-type').split('/').pop(), {type: data.getResponseHeader('content-type')}))
}

export function convert(file, progress$, workize = false){
  const bitrate = 192 // should be an argument
  var video = file.name
  var audio = file.name.split(/\.+/).slice(0, -1).join('.') + '.mp3'

  return Rx.Observable
    .fromFileReader(file)
    .map(buffer => ({
      type: 'run',
      MEMFS: [{name: video, data: buffer}],
      stdin: null,
      arguments: ['-i', video, '-ac', '2', '-ab', bitrate + '000', '-vn', audio]
    }))
    .mergeMap(job => {
      if(!workize){
        return Rx.Observable.of(ffmpeg(job))
      }

      const worker = new fworker() // ffmpeg worker
      var regexp, duration, current

      return Rx.Observable
        .fromWorker(worker)
        .map(msg => {
          switch(msg.type){
            case 'ready':
              worker.postMessage(job)
            break
            case 'stderr':
              regexp = /Duration: ([\.0-9\:]+)/
              if(regexp.test(msg.data)){
                duration = moment.duration(msg.data.match(regexp)[1]).asMilliseconds()
              }

              regexp = /time=([\.0-9\:]+)/
              if(regexp.test(msg.data)){
                current = moment.duration(msg.data.match(regexp)[1]).asMilliseconds()
                progress$.next({
                  type: 'convert',
                  value: Math.floor((current / duration) * 100)
                })
              }
            break
            case 'done':
              return msg.data
          }

          return null
        })
        .filter(next => next)
        .do(() => worker.terminate())
    })
    .map(result => result.MEMFS[0])
    .mergeMap(out => typeof out.data !== 'undefined' ? Rx.Observable.of(out) : Rx.Observable.throw())
    .map(out => Buffer(out.data))
    .map(buffer => new File([buffer], audio, {type: 'audio/mpeg'}))
    .catch(error => {
      throw new Error('Unexpected behavior during conversion')
    })
}

export function labelize(file, id3){
  return Rx.Observable
    .fromFileReader(file)
    .map(buffer => new ID3Writer(buffer))
    .do(writer => writer
      .setFrame('TIT2', id3.song)
      .setFrame('TPE1', [id3.artist])
      .setFrame('APIC', {
        type: 3,
        data: id3.cover,
        description: 'Youtube thumbnail'
      })
      .addTag()
    )
    .map(writer => Buffer.from(writer.arrayBuffer))
    .map(buffer => new File([buffer], file.name, {type: 'audio/mpeg'}))
    .catch(error => {
      throw new Error('Unexpected behavior during id3 labeling')
    })
}
