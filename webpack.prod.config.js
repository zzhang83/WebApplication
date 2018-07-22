var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
var config = require('./webpack.base.config.js')

config.devtool = "#eval-source-map"

config.output.publicPath = '/static/bundles/local/'


config.plugins = config.plugins.concat([
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
