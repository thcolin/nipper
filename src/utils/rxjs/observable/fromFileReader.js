import { Observable } from 'rxjs/Observable'

function fromFileReader(file){
  return Observable.create(subscriber$ => {
    const reader = new FileReader()

    reader.onload = (e) => {
      subscriber$.next(e.target.result)
      subscriber$.complete()
    }

    reader.readAsArrayBuffer(file)
  })
}

Observable.fromFileReader = fromFileReader
