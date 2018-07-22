var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
var config = require('./webpack.base.config.js')

var ip = 'localhost'

config.entry = {
  App1: [
    'webpack-dev-server/client?http://' + ip + ':3000',
    'webpack/hot/only-dev-server',
    './backendApp/static/reactjs/App1',
  ],
}

config.output.publicPath = 'http://' + ip + ':3000' + '/assets/bundles/'
config.devtool = "#eval-source-map"

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new BundleTracker({filename: './webpack-stats-local.json'}),
])

config.module.loaders.push(
  { test: /\.jsx$/,
    loaders: ['babel'],
    exclude: /node_modules/,
    options: {
        cacheDirectory: true,
        plugins: [
            'react-hot-loader/babel'
        ]
    }
  }
)

config.module.loaders.push(
  { test: /\.css?$/, exclude: /node_modules/, loaders:  [ 'style-loader', 'css-loader' ] }
)

module.exports = config
