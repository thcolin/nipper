const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const JarvisPlugin = require("webpack-jarvis")
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/',
    overlay: true,
    // useLocalIp: true,
    proxy: {
      '/proxify': 'http://localhost:3000'
    }
  },
  plugins: [
    new JarvisPlugin({
      port: 1337
    })
  ]
})
