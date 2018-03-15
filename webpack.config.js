const path = require('path');
const config = require('./project.config.js');

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, config.dist)
  },
  devtool: config.isDevelopment ? 'cheap-module-eval-source-map' : false,
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
          loader: 'babel-loader'
        }
      }
    ]
  }
};
