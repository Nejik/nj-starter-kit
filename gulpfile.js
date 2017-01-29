const config = require('./configs/project.config.js');
const webpackConfig = require('./configs/webpack.config.js');
const postcssConfig = require('./configs/postcss.config.js');

//common
const del = require('del');
const path = require('path')
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');

//html
const through = require('through2');
const ejs = require('ejs');
const assign = require('object-assign');

//styles
const postcss = require('gulp-postcss');

//js
const webpack = require('webpack');

//server
let serverStarted = false;
const bs = require('browser-sync').create();


gulp.task('clean', function () {
  return del([config.dist])
})

function gulpEjs(data, options) {
  data = data || {};
  options = options || {};
  
  return through.obj(function (file, enc, cb) {
              if (file.isNull()) {
                  this.push(file);
                  return cb();
              }
            
              if (file.isStream()) {
                  this.emit(
                      'error',
                      new gutil.PluginError('gulp-ejs', 'Streaming not supported')
                  );
              }

              data = assign({}, data, file.data);
              
              options = assign({}, options)
              options.filename = file.path;
              
              try {
                file.contents = new Buffer(
                    ejs.render(file.contents.toString(), data, options)
                );
                
                //change extension from ejs to html
                file.path = gutil.replaceExtension(file.path, '.html');
                  
              } catch (err) {
                  this.emit('error', new gutil.PluginError('gulp-ejs', err.toString()));
              }
            
              this.push(file);

              cb();
            })
}
gulp.task('html', function () {
  return gulp.src(config.html.src)
            .pipe(gulpEjs({//data
              
            }, {//options
              root: config.src
            })).on('error', gutil.log)
            .pipe(gulp.dest(config.html.dist))
            .pipe(gulpIf(config.isDevelopment, bs.stream()))
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
  // gulp.watch(paths.html.watch_partials, gulp.series('html_partials'));

  gulp.watch(config.html.watch, gulp.series('html'));
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












gulp.task('build', gulp.parallel('html','css','webpack'))
gulp.task('prod', gulp.series('clean', gulp.parallel('html','css','webpack')))


gulp.task('default', gulp.series('build', gulp.parallel('serve','watch')))