import 'isomorphic-fetch'
import queryString from 'query-string'

class epyd{
  constructor(){
    this.contexts = []
  }

  handle(id){
    return this.grab(id)
      .then(this.bestest)
      .then(stream => {
        if(typeof stream.s !== 'undefined'){
          return this.decrypt(stream)
        } else{
          return stream
        }
      })
      .then(this.download)
      // .then(this.labelize)
      // .then(this.extract)
  }

  grab(id){
    return fetch('//www.youtube.com/watch?v=' + id + '&gl=US&persist_gl=1&hl=en&persist_hl=1')
      .then(response => response.text())
      // handle possible error
      .then(content => /ytplayer\.config\s+=\s+({.*?});ytplayer/.exec(content)[1])
      .then(json => JSON.parse(json))
      .then(config => {
        var list = [
          queryString.parse(config.args.url_encoded_fmt_stream_map)
        ]

        if(typeof config.args.adaptive_fmts !== 'undefined'){
          list.push(queryString.parse(config.args.adaptive_fmts))
        }

        return [].concat(...list.map((streams) => {
          let l = streams.itag.length
          const mapped = []

          for(let i = 0; i < l; i++){
            const stream = {
              asset: config.assets.js
            }

            for(let key in streams){
              if(['itag', 's', 'url'].indexOf(key) !== -1){
                stream[key] = Array.isArray(streams[key]) ? streams[key][i]:streams[key]
              }
            }

            mapped.push(stream)
          }

          return mapped
        }))
      })
  }

  bestest(streams){
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

  decrypt(stream){
    var index = this.contexts.indexOf(stream.asset)
    var promise

    if(index !== -1){
      promise = new Promise(() => this.contexts[index])
    } else{
      promise = fetch('//www.youtube.com/' + stream.asset)
        .then(response => response.text())
        .then(context => {
          this.contexts[stream.asset] = context
          return context
        })
    }

    return promise
      .then(context => {
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
        var executor = 'return ' + decryptor + '("' + stream.s + '")'

        return [...helpers, algorithm, executor].join('; ') + ';'
      })
      .then(expression => {
        return new Function(expression)()
      })
      .then(signature => {
        return Object.assign(stream, {
          signature
        })
      })
  }

  download(stream){
    console.log('download', stream)
    return stream
  }

  extract(stream){
    console.log('extract', stream)
    return stream
  }

  labelize(stream){
    console.log('labelize', stream)
    return stream
  }

  zip(streams){

  }
}

export default new epyd
