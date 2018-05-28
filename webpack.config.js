var path = require('path')
var webpack = require('webpack')

var DEBUG = !(process.env.NODE_ENV === 'production')

if (DEBUG) {
  require('dotenv').config()
}

var config = {
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
  mode: DEBUG ? 'development' : 'production',
  entry: {
    app: ['./app/app'],
    vendor: [
      'react',
      'react-router',
      'redux',
      'react-dom',
      'lodash',
      'bluebird',
      'humps',
      'history'
    ]
  },
  resolve: {
    modules: [path.join(__dirname, 'app'), 'node_modules']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV', 'PORT', 'API_BASE_URL'])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  }
}

if (DEBUG) {
  config.entry.app.push('webpack-hot-middleware/client?path=/__webpack_hmr')

  config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ])
  config.output.publicPath = '/'
  config.module.rules.unshift({
    test: /\.js$/,
    loader: 'react-hot-loader',
    exclude: /node_modules/,
    include: __dirname
  })
} else {
  config.optimization.minimize = true
}

module.exports = config
