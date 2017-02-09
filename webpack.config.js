const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


const config = require('./project.config.js');
const pkg = require('./package.json');


const babelConfig = Object.assign({}, pkg.babel, {
  babelrc: false,
  cacheDirectory: true,
});

const webpackConfig = {
  // The base directory for resolving the entry option
  context: config.src,

  // The entry point for the bundle
  entry: config.js.src,

  // Options affecting the output of the compilation
  output: {
    path: config.js.dist,
    publicPath: config.publicPath,
    // filename: config.isDevelopment ? 'bundle.js?[hash]' : 'bundle.[hash].js',
    filename: 'bundle.js',
    // chunkFilename: config.isDevelopment ? '[id].js?[chunkhash]' : '[id].[chunkhash].js',
    chunkFilename: '[id].js',
    sourcePrefix: '  ',
  },

  //todo, add resolve option for js/css/libs

  // Switch loaders to debug or release mode
  // debug: config.isDevelopment,

  // Developer tool to enhance debugging, source maps
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: config.isDevelopment ? 'inline-source-map' : false,

  // What information should be printed to the console
  stats: {
    colors: true,
    reasons: config.isDevelopment,
    hash: config.isVerbose,
    version: config.isVerbose,
    timings: true,
    chunks: config.isVerbose,
    chunkModules: config.isVerbose,
    cached: config.isVerbose,
    cachedAssets: config.isVerbose,
  },

  // The list of plugins for Webpack compiler
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': config.isDevelopment ? '"development"' : '"production"',
      __DEV__: config.isDevelopment,
    }),
    // Emit a JSON file with assets paths
    // https://github.com/sporto/assets-webpack-plugin#options
    new AssetsPlugin({
      path: config.js.dist,
      filename: 'assets.json',
      prettyPrint: true,
    }),
  ],

  // Options affecting the normal modules
  module: {
    rules: [
      {
        test: /.js?$/,
        loader: `babel-loader?${JSON.stringify(babelConfig)}`,
      }
    ],
  }
};

if (config.isDevelopment) {
  webpackConfig.entry.unshift('webpack-hot-middleware/client?overlay=false&reload=true&noInfo=true&overlay=false');
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
  webpackConfig.module.rules.push({
     test: /.css$/,
     use: [
       'style-loader',
      //  {
      //    loader: 'css-loader',
      //    query: {
      //      'sourceMap': 'inline',
      //      'importLoaders':1
      //    }
      //  },
       'css-loader?sourceMap=inline&importLoaders=1',
       'postcss-loader'
     ]
    //  loader: 'style-loader!css-loader?sourceMap=inline'
  });
  // webpackConfig.plugins.push(new ExtractTextPlugin({
  //                                                   filename: "app.css"
  //                                                 }))
  // webpackConfig.module.rules.push({
  //                                   test: /\.css$/,
  //                                   use: ExtractTextPlugin.extract({
  //                                           use: [
  //                                             'style-loader',
  //                                             'css-loader?importLoaders=1',
  //                                             'postcss-loader'
  //                                           ]
  //                                         })
                                    
  //                                 });
 
} else {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: config.isVerbose } }));
  webpackConfig.plugins.push(new webpack.optimize.AggressiveMergingPlugin());


  
}

module.exports = webpackConfig;