const express = require('express')
const request = require('request')
const cors = require('cors')
const atob = require('atob')

const app = express()

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz'
  res.set('Content-Encoding', 'gzip')
  next()
})

if (process.argv.indexOf('--only-proxy') == -1) {
  app.use(express.static('./build'))
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './build', 'index.html'))
  })
}

app.use(cors())
app.get('/proxify', function (req, res) {
  var url = atob(req.query.url)

  if(url.match(/youtu\.?be(\.com)?|ytimg\.com|googlevideo\.com/)){
    console.log('[proxify] ACCEPT - ' + url)
    req.pipe(request(url)).pipe(res)
  } else{
    console.log('[proxify] DENY - ' + url + ' - ' + JSON.stringify(req.query))
    res.status(403).send('URL is blacklisted!')
  }
})

app.listen(process.env.PORT || 3000)
