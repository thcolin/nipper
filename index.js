var express = require('express')
var request = require('request')
var cors = require('cors')
var atob = require('atob')

var app = express()

if (process.argv.indexOf('--only-proxy') == -1) {
  app.use(express.static('./build'))
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './build', 'index.html'))
  })
}

app.use(cors())
app.get('/proxify', function (req, res) {
  var url = atob(req.query.url)
  console.log('') // empty line

  if(url.match(/youtu\.?be(\.com)?|ytimg\.com|googlevideo\.com/)){
    console.log('[proxify] ACCEPT - ' + url)
    req.pipe(request(url)).pipe(res)
  } else{
    console.log('[proxify] DENY - ' + url + ' - ' + JSON.stringify(req.query))
    res.status(403).send('URL is blacklisted!')
  }
})

app.listen(process.env.PORT || 3000)
