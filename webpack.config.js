const path = require('path');
const config = require('./project.config.js');

const webpackConfig = {
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, config.dist)
  },
  devtool: config.isDevelopment ? 'cheap-module-eval-source-map' : false,
  mode: config.isDevelopment ? 'development' : 'production',
  resolve: {
    // prettier-ignore
    modules: [
      config.src,
      config.components,
      'node_modules'
    ]
  },
  module: {
    rules: []
  }
};
if (config.js.dialect === 'typescript') {
  webpackConfig.entry = './src/js/app.ts';
  webpackConfig.module.rules.push(
    {
      test: /\.js|\.tsx?$/,
      // use: 'ts-loader', ts-loader VERY very slow with allowJs option
      use: 'awesome-typescript-loader',
      exclude: /node_modules/
    }
  )
} else {
  webpackConfig.entry = './src/js/app.js';
  webpackConfig.module.rules.push(
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }
  )
}
module.exports = webpackConfig;
