import { Subject, of, merge } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { filter, map, mergeMap, catchError, finalize, timeout, retry, tap } from 'rxjs/operators'
import retryWithDelay from 'more/rxjs/operators/retryWithDelay'
import qs from 'qs'
import rescape from 'escape-string-regexp'
import crawler, { download } from 'store/utils/crawler'
import transcoder, { extract, convert, labelize } from 'store/utils/transcoder'
import CODECS from 'store/codecs'

const VIDEO_URL = 'https://www.youtube.com/watch?v=__ID__&gl=US&hl=en&persist_hl=1&has_verified=1&bpctr=9999999999'
const YTPLAYER_REGEXP = /ytplayer\.config\s+=\s+({.*?});ytplayer/
const CACHE = []

// handicap strategy : lighten file is better
export const FORMATS = {
  // standard videos
  17: { acodec: CODECS['aac'], vcodec: null, abr: 24, handicap: 1 },
  18: { acodec: CODECS['aac'], vcodec: CODECS['mp4'], abr: 96, handicap: 2 },
  22: { acodec: CODECS['aac'], vcodec: CODECS['mp4'], abr: 192, handicap: 4 },
  37: { acodec: CODECS['aac'], vcodec: CODECS['mp4'], abr: 192, handicap: 5 },
  38: { acodec: CODECS['aac'], vcodec: CODECS['mp4'], abr: 192, handicap: 6 },
  43: { acodec: CODECS['vorbis'], vcodec: CODECS['webm'], abr: 128, handicap: 2 },
  44: { acodec: CODECS['vorbis'], vcodec: CODECS['webm'], abr: 128, handicap: 3 },
  45: { acodec: CODECS['vorbis'], vcodec: CODECS['webm'], abr: 192, handicap: 4 },
  46: { acodec: CODECS['vorbis'], vcodec: CODECS['webm'], abr: 192, handicap: 5 },
  59: { acodec: CODECS['aac'], vcodec: CODECS['mp4'], abr: 128, handicap: 3 },
  78: { acodec: CODECS['aac'], vcodec: CODECS['mp4'], abr: 128, handicap: 3 },

  // dash mp4 aac audio
  139: { acodec: CODECS['aac'], abr: 48, handicap: 0 },
  140: { acodec: CODECS['aac'], abr: 128, handicap: 0 },
  141: { acodec: CODECS['aac'], abr: 256, handicap: 0 },

  // dash webm vorbis audio
  171: { acodec: CODECS['vorbis'], abr: 128, handicap: 0 },
  172: { acodec: CODECS['vorbis'], abr: 256, handicap: 0 },

  // dash webm opus audio
  249: { acodec: CODECS['opus'], abr: 50, handicap: 0 },
  250: { acodec: CODECS['opus'], abr: 70, handicap: 0 },
  251: { acodec: CODECS['opus'], abr: 160, handicap: 0 }
}

const STAGES = {
  default: {
    download: 0.40,
    extract: 0.10,
    convert: 0.49,
    labelize: 0.01
  },
  effortless: { // is video, audio requested, but same codec as requested
    download: 0.89,
    extract: 0.10,
    labelize: 0.01
  },
  lazy: { // exact same format as requested (dash audio or video)
    download: 0.99,
    labelize: 0.01
  }
}

export default (id, codec, tags) => {
  const filename = `${tags.artist} - ${tags.song}`
  const progress$ = new Subject()

  let stages // different according to best stream and requested codec
  let quality = 160 // min quality for best(), reduced by 64 after each retrieve() try, YouTube can randomly return different amount of streams

  console.warn('[youtube]', id, '-', `"${filename}.${codec.extension}"`)

  return merge(
    progress$.pipe(
      map(progress => ({ type: 'progress', data: progress }))
    ),
    crawler.schedule(retrieve(id)).pipe(
      map(message => peel(message.data.response)),
      map(ytplayer => cast(ytplayer)),
      map(streams => validate(streams)),
      map(streams => best(streams, codec, { quality: quality })),
      retryWithDelay(3, 2000, () => quality -= 64), // eslint-disable-line no-return-assign
      tap(stream => {
        if (stream.format.acodec.name === codec.name && stream.format.vcodec) {
          stages = STAGES.effortless
        } else if (stream.format.acodec.name === codec.name && !stream.format.vcodec) {
          stages = STAGES.lazy
        } else if (stream.format.vcodec && stream.format.vcodec.name === codec.name) {
          stages = STAGES.lazy
        } else {
          stages = STAGES.default
        }
      }),
      mergeMap(stream => solve(stream).pipe(retry(2))),
      mergeMap(stream => crawler.schedule(
        download(`${stream.url}${(stream.signature ? '&signature=' + stream.signature : '')}`, filename).pipe(
          tap(() => console.log('[youtube]', id, '-', 'download'))
        )
      ).pipe(
        filter(message => message.type !== 'progress' || progress$.next(progress(message.data, 'download', stages))),
        mergeMap(message => !stages.extract ? of(message.data) : transcoder.schedule(extract(message.data, stream.format.acodec)).pipe(
          filter(message => message.type !== 'progress' || progress$.next(progress(message.data, 'extract', stages))),
          retryWithDelay(1, 0, () => progress$.next(progress(0, 'extract', stages)))
        )),
        mergeMap(message => !stages.convert ? of(message.data) : transcoder.schedule(convert(message.data, codec)).pipe(
          filter(message => message.type !== 'progress' || progress$.next(progress(message.data, 'convert', stages))),
          retryWithDelay(1, 0, () => progress$.next(progress(0, 'convert', stages)))
        )),
        mergeMap(message => labelize(message.data, tags).pipe(
          filter(message => message.type !== 'progress' || progress$.next(progress(message.data, 'labelize', stages))),
          retryWithDelay(1, 0, () => progress$.next(progress(0, 'labelize', stages)))
        )),
        retryWithDelay(1, 0, () => progress$.next(progress(0, 'download', stages)))
      )
      ),
      catchError(error => {
        console.warn('[youtube]', id, '-', error)
        throw new Error(`Process of **${id}** throw an error : "${(error.message || error)}"`)
      }),
      retryWithDelay(2, 1000, () => progress$.next(progress(0, 'download', stages))),
      finalize(() => progress$.complete())
    )
  )
}

function progress (value, current, stages) {
  var total = 0

  for (var key in stages) {
    if (key === current) {
      total += value * stages[key]
      break
    } else {
      total += 100 * stages[key]
    }
  }

  return total
}

export function retrieve (id) {
  return ajax({
    url: VIDEO_URL.replace(/__ID__/, id),
    responseType: 'text'
  }).pipe(
    tap(() => console.log('[youtube]', id, '-', 'retrieve')),
    map(data => ({ type: 'done', data })),
    catchError(error => {
      throw new Error(`Retrieve request failed because of: ${error.message}`)
    }),
    timeout(5000)
  )
}

export function peel (body) {
  if (!YTPLAYER_REGEXP.test(body)) {
    // Copyright, +18...
    throw new Error('Object ytplayer.config not found in body')
  }

  return JSON.parse(YTPLAYER_REGEXP.exec(body)[1])
}

export function cast (ytplayer) {
  const build = ({ itag, url, asset, s }) => (!itag || !FORMATS[itag]) ? null : {
    itag: itag,
    format: FORMATS[itag],
    score: 0,
    url,
    asset,
    s,
    signature: null
  }

  return ['url_encoded_fmt_stream_map', 'adaptive_fmts']
    .map(key => ytplayer.args[key] || null)
    .filter(streams => streams)
    .map(streams => qs.parse(streams))
    .filter(streams => Array.isArray(streams.itag))
    .map(streams => (Array.isArray(streams.url) ? streams.url : [streams.url])
      .map((url, index) => build({
        itag: parseInt((url.match(/itag=(\d+)/) || [0, 0])[1]),
        url: (Array.isArray(streams.url) ? streams.url[index] : streams.url).split(',')[0],
        asset: ytplayer.assets.js,
        s: (Array.isArray(streams.s) ? streams.s[index] : streams.s) || (url.match(/s=([.a-zA-Z0-9])+/) || [null, null])[1]
      }))
      .filter(stream => stream)
    )
    .reduce((accumulator, streams) => [...accumulator, ...streams], [])
}

export function validate (streams) {
  const filtered = streams.filter(stream => Object.keys(FORMATS).includes(stream.itag.toString()))

  if (!filtered.length) {
    throw new Error('No suitable stream')
  }

  return filtered
}

export function best (streams, codec, options = {}) {
  const best = streams
    .filter(stream => codec.type !== 'video' || stream.format.vcodec)
    .map(stream => ({
      ...stream,
      score: stream.format.abr - stream.format.handicap + (32 * (
        stream.format.acodec.name === codec.name || ((stream.format.vcodec || {}).name === codec.name)
      ))
    }))
    .sort((a, b) => a.score - b.score)
    .pop()

  if (!best || (options.quality || 0) > best.format.abr) {
    throw new Error(`Unavailable best stream for codec "${codec.name}"`)
  }

  const choosen = best.format[codec.type === 'video' ? 'vcodec' : 'acodec']

  if (codec.name !== choosen.name) {
    console.warn('[youtube]', `Unable to find matching "${codec.name}" codec with best abr in YouTube streams, choose "${choosen.name}" (${best.format.abr}kbps) instead to converting it later`)
  }

  return best
}

export function solve (stream) {
  if (stream.s === null) {
    return of(stream)
  }

  var fetchable = ajax({
    url: `https://www.youtube.com${stream.asset}`,
    responseType: 'text'
  }).pipe(
    tap(() => console.log('[youtube]', stream.asset, '-', 'solve')),
    catchError(error => {
      throw new Error(`Solve request failed because of ${error.message}`) // (string) xhr.statusText
    }),
    map(data => data.response),
    map(body => simplify(body)),
    tap(expression => CACHE[stream.asset] = expression) // eslint-disable-line no-return-assign
  )

  return of(stream.asset).pipe(
    mergeMap(asset => CACHE[stream.asset] ? of(CACHE[stream.asset]) : fetchable),
    map(expression => ({
      ...stream,
      signature: new Function(expression.replace(/__SIGNATURE__/, stream.s))() // eslint-disable-line no-new-func
    }))
  )
}

export function simplify (body) {
  let matches
  let decryptor
  let algorithm
  let dependencies = []
  let helpers = []

  /* eslint-disable no-cond-assign */
  if (matches = /(?:["'])signature\1\s*,\s*([a-zA-Z0-9$]+)\(/.exec(body)) {
    decryptor = matches[1]
  } else if (matches = /\.sig\|\|([a-zA-Z0-9$]+)\(/.exec(body)) {
    decryptor = matches[1]
  } else if (matches = /yt\.akamaized\.net\/\)\s*\|\|\s*.*?\s*c\s*&&\s*d\.set\([^,]+\s*,\s*([a-zA-Z0-9$]+)\(/.exec(body)) {
    decryptor = matches[1]
  } else if (matches = /\bc\s*&&\s*d\.set\([^,]+\s*,\s*([a-zA-Z0-9$]+)\(/.exec(body)) {
    decryptor = matches[1]
  } else {
    throw new Error('Decryptor function name not found')
  }

  if (matches = new RegExp(`(${rescape(decryptor)}\\s*=\\s*function\\s*\\([a-zA-Z]+\\)\\s*{.*?});`).exec(body)) {
    algorithm = matches[1]
  } else {
    throw new Error(`Algorithm function "${decryptor}" not found`)
  }

  const regexp = /([\w$]+)(\.\w+)?\(\w+,.*?\)/g
  while (matches = regexp.exec(algorithm)) {
    if (!dependencies.includes(matches[1])) {
      dependencies.push(matches[1])
    }
  }

  dependencies.forEach(dependency => {
    if (matches = new RegExp(`(var\\s*${rescape(dependency)}=[\\s\\S]*?});`).exec(body)) {
      helpers.push(matches[1])
    } else {
      throw new Error(`Helper var "${dependency}" not found`)
    }
  })
  /* eslint-enable no-cond-assign */

  const executor = `return ${decryptor}("__SIGNATURE__")`

  return `${[...helpers, algorithm, executor].join('; ')};`
}
