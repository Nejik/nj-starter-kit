const del = require('del');
const path = require('path')
const gulp = require('gulp');
const gulpIf = require('gulp-if');

const bs = require('browser-sync').create();
let serverStarted = false;
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');



const paths = {

}

gulp.task('clean', function () {
  return del(['public'])
})

gulp.task('watch', function () {
  // gulp.watch(paths.html.watch, gulp.series('html'));
  // gulp.watch(paths.html.watch_partials, gulp.series('html_partials'));

  // gulp.watch(paths.css.watch, gulp.series('css')); 
  // gulp.watch(paths.jsVendor.watch, gulp.series('js:vendor')); //js bundled by webpack and webpack has own watcher, but vendors concataneted by gulp
  // gulp.watch(paths.images.watch, gulp.series('images'));
})

gulp.task('serve', function (cb) {
  const compiler = webpack(webpackConfig);

  const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: webpackConfig.stats,
  });

  compiler.plugin('done', stats => {
    console.log('done')

    if (serverStarted) {
      bs.reload()
    } else {
      serverStarted = true;
      gulp.src('./src/index.html')
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
})

gulp.task('default', gulp.series('serve'))