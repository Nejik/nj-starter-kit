const config = require('./configs/project.config.js');
const webpackConfig = require('./configs/webpack.config.js');

//common
const del = require('del');
const path = require('path')
const gulp = require('gulp');
const gulpIf = require('gulp-if');


//styles
const postcssConfig = require('./configs/postcss.config.js');

const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//js
const webpack = require('webpack');

//server
let serverStarted = false;
const bs = require('browser-sync').create();


gulp.task('clean', function () {
  return del([config.src])
})

gulp.task('styles', function () {
  return gulp .src('src/css/styles.css')
              .pipe(gulpIf(config.isDevelopment, sourcemaps.init()))
              .pipe(postcss(postcssConfig))
              .pipe(gulpIf(config.isDevelopment, sourcemaps.write()))
              .pipe(gulp.dest('dist'))
              .pipe(gulpIf(config.isDevelopment, bs.stream()))
})

gulp.task('watch', function () {
  // gulp.watch(paths.html.watch, gulp.series('html'));
  // gulp.watch(paths.html.watch_partials, gulp.series('html_partials'));

  gulp.watch('src/**/*.css', gulp.series('styles')); 
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
    if (serverStarted) {
      bs.reload()
    } else {
      serverStarted = true;
      gulp.src('./src/index.html')
        .pipe(gulp.dest(config.dist))

      bs.init({
        open: false,
        port: process.env.PORT || 3000,
        ui: { port: Number(process.env.PORT || 3000) + 1 },
        server: {
          baseDir: config.dist,
          middleware: [
            webpackDevMiddleware,
            require('connect-history-api-fallback')(),
          ],
        },
      });
    }
  });
})














gulp.task('default', gulp.parallel('serve','watch'))