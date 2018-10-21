import { of, from, throwError } from 'rxjs'
import { map, mergeMap, catchError, tap } from 'rxjs/operators'
import fromFileReader from 'more/rxjs/fromFileReader'
import fromFFMPEG from 'more/rxjs/fromFFMPEG'
import ID3 from 'browser-id3-writer'
import CODECS from 'store/codecs'
import Queue from 'store/utils/queue'

export default new Queue(1)

function transcode (name, file, codec, options) {
  const input = `input.${file.name.split('.').pop()}`
  const output = file.name.split('.').slice(0, -1).concat(codec.extension).join('.')

  return fromFileReader(file)
    .pipe(
      map(buffer => ({
        name: name,
        type: 'run',
        MEMFS: [{ name: input, data: buffer }],
        stdin: null,
        arguments: [
          '-i', input
        ]
          .concat(options)
          .concat(codec.options || [])
          .concat(`output.${codec.extension}`)
      })),
      mergeMap(job => fromFFMPEG(job)
        .pipe(
          mergeMap(message => message.type !== 'done' ? of(message) : of(message.data).pipe(
            map(result => result.MEMFS[0]),
            mergeMap(out => typeof out.data !== 'undefined' ? of(out) : throwError()),
            map(out => Buffer.from(out.data)),
            map(buffer => new File([buffer], output, { type: `audio/${codec.name}` })),
            map(file => ({ type: 'done', data: file }))
          ))
        )
      ),
      catchError(error => {
        console.warn('[transcode]', error)
        throw new Error(`Unexpected behavior during ffmpeg transcode (${name}) from ${file.type} to ${codec.type}/${codec.name}`)
      })
    )
}

export function extract (file, codec) {
  return transcode('extract', file, codec, [
    '-vn',
    '-c:a', 'copy'
  ])
}

export function convert (file, codec) {
  return transcode('convert', file, codec, [
    '-c:a', codec.library
  ])
}

export function labelize (file, tags) {
  return fromFileReader(file).pipe(
    mergeMap(buffer => {
      switch (file.type) {
        // only id3 is able to apply cover art
        case 'audio/mp3':
          return of(new ID3(buffer)).pipe(
            mergeMap(writer => fromFileReader(tags.cover).pipe(
              tap(cover => writer
                .setFrame('TIT2', tags.song)
                .setFrame('TPE1', [tags.artist])
                .setFrame('APIC', {
                  type: 3,
                  data: cover,
                  description: 'YouTube thumbnail'
                })
                .addTag()
              ),
              map(() => Buffer.from(writer.arrayBuffer))
            )),
            mergeMap(buffer => from([
              { type: 'progress', data: 100 },
              { type: 'done', data: new File([buffer], file.name, { type: file.type }) }
            ]))
          )
        // else (audio) simply run ffmpeg !
        case 'audio/aac':
        case 'audio/vorbis':
        case 'audio/opus':
          console.warn('[nipper]', `Unable to illustrate "${file.name}" with MIME type ${file.type}`)

          var codec = CODECS[file.type.split('/')[1]]
          var out = file.name.split(/\.+/).slice(0, -1).concat(['tagged', codec.extension]).join('.')
          var job = {
            type: 'run',
            MEMFS: [{ name: file.name, data: buffer }],
            stdin: null,
            arguments: [
              '-i', file.name,
              '-c:a', 'copy',
              '-metadata', `artist=${tags.artist}`,
              '-metadata', `title=${tags.song}`
            ]
              .concat(codec.options || [])
              .concat(out)
          }

          return fromFFMPEG(job).pipe(
            mergeMap(message => message.type !== 'done' ? of(message) : of(message.data).pipe(
              map(result => result.MEMFS[0]),
              mergeMap(out => typeof out.data !== 'undefined' ? of(out) : throwError()),
              map(out => Buffer.from(out.data)),
              map(buffer => new File([buffer], file.name, { type: file.type })),
              map(file => ({ ...message, data: file }))
            ))
          )
        // else (video)
        default:
          return of(buffer).pipe(
            mergeMap(buffer => from([
              { type: 'progress', data: 100 },
              { type: 'done', data: new File([buffer], file.name, { type: file.type }) }
            ]))
          )
      }
    }),
    catchError(error => {
      console.warn('[labelize]', error)
      throw new Error(`Unexpected behavior during labelizing of ${file.type}`)
    })
  )
}
