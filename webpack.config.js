const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const getConfig = require('./project.config.js');
let config = getConfig();

const babelConfig = Object.assign({}, pkg.babel, {
  babelrc: false,
  cacheDirectory: true,
});

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  devtool: config.isDevelopment ? 'eval' : false,
  mode: config.isDevelopment ? 'development' : 'production',
  resolve: {
    modules: [
      config.src,
      config.components,
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
