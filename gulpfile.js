const config = require('./configs/project.config.js');
const webpackConfig = require('./configs/webpack.config.js');
const postcssConfig = require('./configs/postcss.config.js');

//common
const del = require('del');
const path = require('path')
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');


//styles
const postcss = require('gulp-postcss');

//js
const webpack = require('webpack');

//server
let serverStarted = false;
const bs = require('browser-sync').create();


gulp.task('clean', function () {
  return del([config.src])
})

gulp.task('html', function () {
  return gulp .src(config.html.src)
              .pipe(gulp.dest(config.html.dist))
})

gulp.task('css', function () {
  return gulp .src(config.css.src)
              .pipe(gulpIf(config.isDevelopment, sourcemaps.init()))
              .pipe(postcss(postcssConfig))
              .pipe(gulpIf(config.isDevelopment, sourcemaps.write()))
              .pipe(gulp.dest(config.css.dist))
              .pipe(gulpIf(config.isDevelopment, bs.stream()))
})

gulp.task('webpack', function (gulpCallback) {
  webpack(webpackConfig, function() {
    gulpCallback();
  });
})

gulp.task('watch', function () {
  // gulp.watch(paths.html.watch, gulp.series('html'));
  // gulp.watch(paths.html.watch_partials, gulp.series('html_partials'));

  gulp.watch(config.css.watch, gulp.series('css'));
  // gulp.watch(paths.jsVendor.watch, gulp.series('js:vendor')); //js bundled by webpack and webpack has own watcher, but vendors concataneted by gulp
  // gulp.watch(paths.images.watch, gulp.series('images'));
})

gulp.task('serve', function (cb) {//serve contains js task, because of webpack integration
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












gulp.task('build', gulp.parallel('html','css'))

gulp.task('default', gulp.series('build', gulp.parallel('serve','watch')))