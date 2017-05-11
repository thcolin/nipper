const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /(node_modules|bower_components)/ },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader' }
    ]
  },
  node: {
    fs: 'empty' // usefull for ffmpeg.js
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), path.join(__dirname, 'resources'), 'node_modules']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body'
    })
  ],
  // devServer: {
  //   host: '0.0.0.0',
  //   port: 8080
  // }
};
