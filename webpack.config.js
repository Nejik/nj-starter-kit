const path = require('path');
const config = require('./project.config.js');

module.exports = {
  entry: './src/js/app.ts',
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
    ],
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
};
