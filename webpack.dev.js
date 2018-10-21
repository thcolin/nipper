const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('./webpack.config.js')

module.exports = merge(config, {
  mode: 'development',
  devtool: false,
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      exclude: [/\-worker\-.*?\.js$/],
    }),
  ],
  devServer: {
    port: 8000,
    proxy: {
      '/proxify': 'http://localhost:7000'
    }
  },
})
