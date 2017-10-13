const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, 'src', 'index.js')
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'build'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|png)$/,
        use: ['url-loader']
      },
      {
        test: /\.svg$/,
        use: ['babel-loader', 'react-svg-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(eot|ttf|svg|woff(2)?)(\?v=\d+\.\d+\.\d+)?$/,
        use: ['url-loader'],
        exclude: /resources/
      }
    ]
  },
  devtool: 'inline-source-map',
  node: {
    fs: 'empty' // usefull for ffmpeg.js
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      resources: path.join(__dirname, 'resources')
    }
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body'
    })
  ],
  devServer: {
    // host: '0.0.0.0',
    // port: 8080,
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/'
  }
};
