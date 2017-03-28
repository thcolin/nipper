import fetch from 'node-fetch' // TODO : Remove if universal
import { unqueryfy } from '../utils' // TODO : Refacto to just 'utils' (webpack with resolve)

// variablize (mp4/webm)
const ffmpeg = require('ffmpeg.js/ffmpeg-mp4.js')

class Stream{
  constructor(itag, asset, url, s){
    this.itag = itag
    this.asset = asset
    this.url = url
    this.s = s || null
    this.signature = null
  }

  toString(){
    return this.url + (this.signature ? '&signature=' + this.signature:'')
  }

  format(){
    switch(this.itag){
      case 18 :
        return {
          // mp4 360p aac@96
        }
      case 43 :
        return {
          // webm 480p vorbis@128
        }
      case 44 :
        return {
          // webm 360p vorbis@128
        }
      case 78 :
        return {
          // mp4 480p aac@128
        }
      case 59 :
        return {
          // mp4 480p aac@128
        }
      case 171 :
        return {
          // webm audio vorbis@128
        }
      case 140 :
        return {
          // mp4 audio aac@128
        }
      case 46 :
        return {
          // webm 1080p vorbis@192
        }
      case 45 :
        return {
          // webm 720p vorbis@192
        }
      case 37 :
        return {
          // mp4 1080p aac@192
        }
      case 22 :
        return {
          // mp4 720p aac@192
        }
      case 172 :
        return {
          // webm audio vorbis@256
        }
      case 141 :
        return {
          // mp4 audio aac@256
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

  process(id){
    return this.grab(id)
      .then((config) => this.melt(config))
      .then((streams) => this.bestest(streams))
      .then((stream) => this.solve(stream))
      .then((stream) => this.download(stream))
      .then((buffer) => this.convert(buffer))
      .then((buffer) => this.labelize(buffer))
  }

  grab(id){
    console.log('grab', id)
    return fetch('https://www.youtube.com/watch?v=' + id + '&gl=US&persist_gl=1&hl=en&persist_hl=1')
      .then(response => response.text())
      // handle possible error
      .then(content => /ytplayer\.config\s+=\s+({.*?});ytplayer/.exec(content)[1])
      .then(json => JSON.parse(json))
  }

  melt(config){
    console.log('melt')
    var list = [
      unqueryfy(config.args.url_encoded_fmt_stream_map)
    ]

    if(typeof config.args.adaptive_fmts !== 'undefined'){
      list.push(unqueryfy(config.args.adaptive_fmts))
    }

    return [].concat(...list.map((streams) => {
      let l = streams.itag.length
      const mapped = []

      for(let i = 0; i < l; i++){
        const obj = {}

        for(let key in streams){
          if(['itag', 's', 'url'].indexOf(key) !== -1){
            obj[key] = Array.isArray(streams[key]) ? streams[key][i]:streams[key]
            obj[key] = obj[key].split(',')[0] // unqueryfy issue ?
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
      promise = fetch('https://www.youtube.com/' + stream.asset)
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
      throw new Error('Decryptor function name not found in : ' + asset)
    }
    var decryptor = regexp.exec(context)[2]

    // algorithm (function)
    regexp = new RegExp('(' + decryptor + '=function\\([a-zA-Z]+\\){.*?});')
    if(!regexp.test(context)){
      throw new Error('Algorithm function "' + decryptor + '" not found in : ' + asset)
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
      regexp = new RegExp('(var ' + dependency + '=[\\s\\S]*?);var')
      if(!regexp.test(context)){
          throw new Error('Helper var "' + dependency + '" not found in : ' + asset)
      }
      helpers.push(regexp.exec(context)[1])
    })

    // executor
    var executor = 'return ' + decryptor + '("__SIGNATURE__")'

    return [...helpers, algorithm, executor].join('; ') + ';'
  }

  download(stream){
    console.log('download', stream.toString())
    return fetch(stream.toString())
      .then(response => response.buffer())
  }

  convert(buffer){
    console.log('convert', buffer)
    return ffmpeg({
      // variablize extension (mp4/webm)
      MEMFS: [{name: 'buffer.mp4', data: buffer}],
      // adaptive -ab
      arguments: ['-i', 'buffer.mp4', '-f', 'mp3', '-ac', '2', '-ab', '192000', '-vn', 'buffer.mp3'],
      print: (data) => console.log(data),
      printErr: (data) => console.log(data)
    })
  }

  labelize(buffer){
    console.log('labelize')
    return buffer
  }
}

export default new epyd
