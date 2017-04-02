import rescape from 'escape-string-regexp'
import ffmpeg from 'ffmpeg.js/ffmpeg-mp4.js'
import ID3Writer from 'browser-id3-writer'
import { unquerify } from 'utils' // TODO : don't bind to a project dependency and use a function inside service

class Stream{
  constructor(itag, asset, url, s){
    this.itag = parseInt(itag)
    this.asset = asset
    this.url = url
    this.s = s || null
    this.signature = null
    this.buffer = null
  }

  toString(){
    return this.url + (this.signature ? '&signature=' + this.signature:'')
  }

  structure(){
    switch(this.itag){
      case 18 :
        return {
          format: 'mp4',
          quality: '360p',
          codec: 'aac',
          bitrate: '96'
        }
      case 43 :
        return {
          format: 'webm',
          quality: '480p',
          codec: 'vorbis',
          bitrate: '128'
        }
      case 44 :
        return {
          format: 'webm',
          quality: '360p',
          codec: 'vorbis',
          bitrate: '128'
        }
      case 78 :
      case 59 :
        return {
          format: 'mp4',
          quality: '480p',
          codec: 'aac',
          bitrate: '128'
        }
      case 171 :
        return {
          format: 'webm',
          quality: 'audio',
          codec: 'vorbis',
          bitrate: '128'
        }
      case 140 :
        return {
          format: 'mp4',
          quality: 'audio',
          codec: 'aac',
          bitrate: '128'
        }
      case 46 :
        return {
          format: 'webm',
          quality: '1080p',
          codec: 'vorbis',
          bitrate: '192'
        }
      case 45 :
        return {
          format: 'webm',
          quality: '720p',
          codec: 'vorbis',
          bitrate: '192'
        }
      case 37 :
        return {
          format: 'mp4',
          quality: '1080p',
          codec: 'aac',
          bitrate: '192'
        }
      case 22 :
        return {
          format: 'mp4',
          quality: '720p',
          codec: 'aac',
          bitrate: '192'
        }
      case 172 :
        return {
          format: 'webm',
          quality: 'audio',
          codec: 'vorbis',
          bitrate: '256'
        }
      case 141 :
        return {
          format: 'mp4',
          quality: 'audio',
          codec: 'aac',
          bitrate: '256'
        }
    }
  }

  sign(signature){
    this.signature = signature
  }
}

class epyd{
  constructor(){
    this.expressions = []
  }

  process(id, id3){
    return this.grab(id)
      .then((config) => this.melt(config))
      .then((streams) => this.bestest(streams))
      .then((stream) => this.solve(stream))
      .then((stream) => this.download(stream))
      .then((stream) => this.convert(stream))
      .then((stream) => this.labelize(stream, id3))
  }

  grab(id){
    console.log('grab', id)
    return fetch('https://www.youtube.com/watch?v=' + id + '&gl=US&persist_gl=1&hl=en&persist_hl=1')
      .then(response => response.text())
      // TODO : handle possible error
      .then(content => /ytplayer\.config\s+=\s+({.*?});ytplayer/.exec(content)[1])
      .then(json => JSON.parse(json))
  }

  melt(config){
    console.log('melt')
    var list = [
      unquerify(config.args.url_encoded_fmt_stream_map)
    ]

    if(typeof config.args.adaptive_fmts !== 'undefined'){
      list.push(unquerify(config.args.adaptive_fmts))
    }

    return [].concat(...list.map((streams) => {
      let l = streams.itag.length
      const mapped = []

      // refacto
      for(let i = 0; i < l; i++){
        const obj = {}

        for(let key in streams){
          if(['itag', 's', 'url'].indexOf(key) !== -1){
            obj[key] = Array.isArray(streams[key]) ? streams[key][i]:streams[key]
            obj[key] = obj[key].split(',')[0] // unquerify issue ?
          }
        }

        mapped.push(new Stream(obj.itag, config.assets.js, obj.url, obj.s))
      }

      return mapped
    }))
  }

  bestest(streams){
    console.log('bestest', streams.length)
    /* STRATEGY  :
      - highest abr is goal
      - audio only is better (lighter files), fallback to video
      - aac is better (faster conversion to mp3 ?), fallback to vorbis
     */
    var qualities = [
      18, // mp4 360p aac@96

      43, // webm 480p vorbis@128
      44, // webm 360p vorbis@128
      78, // mp4 480p aac@128
      59, // mp4 480p aac@128

      171, // webm audio vorbis@128
      140, // mp4 audio aac@128

      46, // webm 1080p vorbis@192
      45, // webm 720p vorbis@192
      37, // mp4 1080p aac@192
      22, // mp4 720p aac@192

      172, // webm audio vorbis@256
      141, // mp4 audio aac@256
    ]

    return streams
      .reduce((current, stream) => {
        var quality = qualities.indexOf(stream.itag)

        if(quality === -1){
          return current
        }

        if(typeof current === 'undefined'){
          return stream
        }

        return (quality > qualities.indexOf(current.itag) ? stream:current)
      })
  }

  solve(stream){
    if(stream.s === null){
      return stream
    }

    console.log('solve', stream.s)
    var index = this.expressions.indexOf(stream.asset)
    var promise

    if(index !== -1){
      promise = new Promise(() => this.expressions[index])
    } else{
      promise = fetch('https://www.youtube.com' + stream.asset)
        .then(response => response.text())
        .then(this.simplify)
        .then(expression => {
          this.expressions.push(expression)
          return expression
        })
    }

    return promise
      .then(expression => {
        return Object.assign(stream, {
          signature: new Function(expression.replace(/__SIGNATURE__/, stream.s))()
        })
      })
  }

  simplify(context){
    let regexp

    // decryptor (function name)
    regexp = /(["|']signature["|'],|.sig\|\|)([\w$]+)\(/
    if(!regexp.test(context)){
      throw new Error('Decryptor function name not found')
    }
    var decryptor = regexp.exec(context)[2]

    // algorithm (function)
    regexp = new RegExp('(' + rescape(decryptor) + '=function\\([a-zA-Z]+\\){.*?});')
    if(!regexp.test(context)){
      throw new Error('Algorithm function "' + decryptor + '" not found')
    }
    var algorithm = regexp.exec(context)[1]

    // dependencies (function names)
    regexp = /(\w+)(\.\w+)?\(\w+,.*?\)/g
    var dependencies = []
    var matches = []

    while(matches = regexp.exec(algorithm)){
      if(dependencies.indexOf(matches[1]) === -1){
        dependencies.push(matches[1])
      }
    }

    // helper (var/function?)
    var helpers = []
    dependencies.forEach(dependency => {
      regexp = new RegExp('(var ' + rescape(dependency) + '=[\\s\\S]*?);var')
      if(!regexp.test(context)){
          throw new Error('Helper var "' + dependency + '" not found')
      }
      helpers.push(regexp.exec(context)[1])
    })

    // executor
    var executor = 'return ' + decryptor + '("__SIGNATURE__")'

    return [...helpers, algorithm, executor].join('; ') + ';'
  }

  download(stream){
    console.log('download', stream.toString(), stream.structure())
    return fetch(stream.toString())
      .then(response => response.arrayBuffer())
      .then(buffer => Object.assign(stream, { buffer }))
  }

  convert(stream){
    console.log('convert', stream)
    var result = ffmpeg({
      MEMFS: [{name: 'buffer.' + stream.structure().format, data: stream.buffer}],
      stdin: () => {},
      arguments: ['-i', 'buffer.' + stream.structure().format, '-ac', '2', '-ab', stream.structure().bitrate + '000', '-vn', 'buffer.mp3'],
      // print: (data) => {},
      // printErr: (data) => console.log(data),
      // onExit: (code) => console.log('Process exited with code ' + code)
    })

    var out = result.MEMFS[0]
    var buffer = Buffer(out.data)
    return Object.assign(stream, { buffer })
  }

  labelize(stream, id3){
    console.log('labelize', id3)
    var writer = new ID3Writer(stream.buffer)

    writer
      .setFrame('TIT2', id3.song)
      .setFrame('TPE1', [id3.artist])
      .setFrame('APIC', {
        type: 3,
        data: id3.cover,
        description: 'Youtube thumbnail'
      })
      .addTag()

    var buffer = Buffer.from(writer.arrayBuffer)
    return Object.assign(stream, { buffer, id3 })
  }
}

export default new epyd
