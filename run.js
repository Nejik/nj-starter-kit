const del = require('del');
const gulp = require('gulp');
const webpack = require('webpack');

const bs = require('browser-sync').create();
const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);
const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: webpackConfig.stats,
});



let serverStarted = false;
compiler.plugin('done', stats => {
  console.log('done')

  if(serverStarted) {
    bs.reload()
  } else {
    serverStarted = true;
    gulp .src('./src/index.html')
         .pipe(gulp.dest('./public/'))
    
    bs.init({
    port: process.env.PORT || 3000,
    ui: { port: Number(process.env.PORT || 3000) + 1 },
    server: {
      baseDir: 'public',
      middleware: [
        webpackDevMiddleware,
        require('connect-history-api-fallback')(),
      ],
    },
  });
  }
});
