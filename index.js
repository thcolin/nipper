const express = require('express')
const request = require('request')
const chalk = require('chalk')
const path = require('path')
const cors = require('cors')
const atob = require('atob')

const app = express()
app.use(cors())

app.get('/proxify', function (req, res) {
  var url = atob(req.query.url)

  if(url.match(/youtu\.?be(\.com)?|ytimg\.com|googlevideo\.com/)){
    console.log(`${chalk.bgGreen(chalk.black(' ALLOW '))} ${chalk.green(url)}`)

    req.pipe(request({
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
      }
    })).pipe(res)
  } else{
    console.log(`${chalk.bgRed(chalk.black(' DENY '))} ${chalk.red(url)} ${chalk.gray(JSON.stringify(req.query))}`)

    res.status(403).send('Blacklisted URL')
  }
})

if (app.get('env') === 'production') {
  app.use(express.static('./dist'))

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './dist', 'index.html'))
  })

  app.get('*.js', function (req, res, next) {
    req.url = req.url + '.gz'
    res.set('Content-Encoding', 'gzip')
    res.set('Content-Type', 'text/javascript')
    next()
  })
}

app.listen(process.env.PORT || (app.get('env') === 'production' ? 8080 : 7000))
