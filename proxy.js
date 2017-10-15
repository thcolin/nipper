var express = require('express')
var request = require('request')
var cors = require('cors')
var atob = require('atob')

var app = express()

app.use(cors())

app.use('/proxify', function(req, res) {
  var a = req.url.replace('/?url=', '')
  var url = atob(a)

  if(url.match(/youtu\.?be(\.com)?|ytimg\.com|googlevideo\.com/)){
    console.log('Proxify : ' + url)
    req.pipe(request(url)).pipe(res)
  } else{
    console.log('Deny : ' + url)
    res.status(403).send('URL is blacklisted!')
  }
})

app.listen(process.env.PORT || 3000)
