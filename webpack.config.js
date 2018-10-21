const path = require('path')
const dotenv = require('dotenv-webpack')
const html = require('html-webpack-plugin')
const favicon = require('favicons-webpack-plugin')

module.exports = {
  entry: {
    app: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')],
    worker: 'ffmpeg.js/ffmpeg-worker-youtube.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: [/node_modules/, /\-worker\-.*?\.js$/],
      },
      {
        test: /\-worker\-.*?\.js$/,
        use: ['worker-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpe?g|png)?$/,
        use: ['file-loader'],
      },
      {
        test: /\.(eot|ttf|svg|woff2?)(\?v=\d+\.\d+\.\d+)?$/,
        use: ['url-loader'],
      }
    ],
  },
  // usefull for ffmpeg.js worker
  node: {
    fs: 'empty',
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
  },
  plugins: [
    new dotenv(),
    new html({
      template: path.join(__dirname, 'src', 'resources', 'index.html'),
    }),
    new favicon({
      logo: path.join(__dirname, 'src', 'resources', 'favicon.png'),
    }),
  ],
}
