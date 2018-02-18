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
    filename: './build/bundle.js'
  },
  resolve: {
    modules: [
      config.src,
      config.components,
      'node_modules'
    ]
  },
  devtool: config.isDevelopment ? 'eval' : false,
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': config.isDevelopment ? '"development"' : '"production"',
      __DEV__: config.isDevelopment,
    })
  ],
  module: {
    rules: [
      {
        test: /.js?$/,
        loader: `babel-loader?${JSON.stringify(babelConfig)}`,
        exclude: /node_modules/
      }
    ]
  }
};