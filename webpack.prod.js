const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('./webpack.config.js')
const screenshot = require('webpack-electroshot-plugin')

module.exports = merge(config, {
  mode: 'production',
  optimization: {
    minimize: false,
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    globalObject: 'this', // usefull for ffmpeg.js worker
  },
  plugins: [
    new screenshot({
      filename: 'screenshot.png',
      format: 'png',
    })
  ]
})
