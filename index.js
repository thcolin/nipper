const path = require('path')
const express = require('express')
const request = require('request')
const cors = require('cors')
const atob = require('atob')

const app = express()
const proxyOnly = process.argv.indexOf('--only-proxy') !== -1

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz'
  res.set('Content-Encoding', 'gzip')
  res.set('Content-Type', 'text/javascript')
  next()
})

if (!proxyOnly) {
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
    req.pipe(request({
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
      }
    })).pipe(res)
  } else{
    console.log('[proxify] DENY - ' + url + ' - ' + JSON.stringify(req.query))
    res.status(403).send('URL is blacklisted!')
  }
})

app.listen(process.env.PORT || (proxyOnly ? 3000 : 8080))
