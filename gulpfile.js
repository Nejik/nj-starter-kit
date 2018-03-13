let config = require('./project.config.js');

let postcssConfig = require('./postcss.config.js');
let webpackConfig = require('./webpack.config.js');

const gulp = require('gulp');
const through2 = require('through2').obj;
const rename = require('gulp-rename');
const gulpIf = require('gulp-if');
const newer = require('gulp-newer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const del = require('del');
const path = require('path');
const notifier = require('node-notifier');

//html
const ejs = require('gulp-ejs');

//css
const postcss = require('gulp-postcss');

//img
const imagemin = require('gulp-image');
const svgSprite = require('gulp-svg-sprite');

//js
const webpack = require('webpack');

//server
let serverStarted = false;
const bs = require('browser-sync').create();









gulp.task('clean', function () {
  return del(['build', 'dist'])
})

gulp.task('html', function () {
  return gulp.src(config.html.src)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error);
        this.emit('end');
      }
    }))
    .pipe(ejs({//data, A hash object where each key corresponds to a variable in your template.
      config: config // get acces to config inside ejs templates (isDevelopment and etc)
    },
      {//options, A hash object for ejs options.
        root: config.src
      },
      {//settings, A hash object to configure the plugin.
        ext: '.html'
      }
    ))
    .pipe(gulp.dest(config.html.dist))
    .pipe(gulpIf(config.isDevelopment, bs.stream()))
})

gulp.task('css', function () {
  return gulp.src(config.css.src)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error);
        this.emit('end');
      }
    }))
    .pipe(gulpIf(config.isDevelopment, sourcemaps.init()))
    .pipe(postcss(postcssConfig.plugins))
    .pipe(gulpIf(config.isDevelopment, sourcemaps.write()))
    .pipe(rename(config.css.concat))
    .pipe(gulp.dest(config.css.dist))
    .pipe(gulpIf(config.isDevelopment, bs.stream()))
})

gulp.task('copy', function () {
  return gulp.src(config.copy.src)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error);
        this.emit('end');
      }
    }))
    .pipe(through2(function (file, enc, callback) {// copy all files from assets folder besides css folder, but css/fonts will be copied to dest folder
      file.path = file.path.replace('assets\\', '').replace('\\assets', '')
      let returnedFile = null;
      if (file.path.indexOf('\\css') !== -1) {
        if (file.path.indexOf('\\css\\fonts\\') !== -1) {
          file.path = file.path.replace('\\css\\fonts\\', '\\fonts\\')
          returnedFile = file
        } else {
          returnedFile = null
        }
      } else {
        returnedFile = file
      }
      callback(null, returnedFile);
    }))
    .pipe(gulp.dest(config.copy.dist))
})

gulp.task('images:copy', function () {
  return gulp.src(config.img.src)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error);
        this.emit('end');
      }
    }))
    .pipe(newer(config.img.dist))
    .pipe(gulp.dest(config.img.dist))
})

gulp.task('images:svg', function () {
  const svgSpriteConfig = {
    mode: {
      inline: true,
      symbol: {
        sprite: config.svgSprites.concat,
        dest: ''
      }
    },
    shape: {
      transform: [
        {
          svgo: {
            plugins: [
              { removeStyleElement: true },
              { removeAttrs: { attrs: '(stroke|fill)' } }
            ],
            js2svg: {
              pretty: config.isDevelopment,
              indent: 2
            }
          }
        }
      ]
    },
    svg: {
      xmlDeclaration: false, // strip out the XML attribute
      doctypeDeclaration: false // don't include the !DOCTYPE declaration
    }
  }

  return gulp.src(config.svgSprites.src)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error);
        this.emit('end');
      }
    }))
    .pipe(through2(function (file, enc, callback) {//remove empty files that leads error in svgSprite
      callback(null, file.stat && file.stat.size ? file : null);
    }))
    .pipe(svgSprite(svgSpriteConfig))
    .pipe(gulp.dest(config.svgSprites.dist))
})

gulp.task('images:optimize', function () {
  return gulp.src(config.img.src)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error);
        this.emit('end');
      }
    }))
    .pipe(imagemin())
    .pipe(gulp.dest(config.img.dist))
})

gulp.task('serve', function (cb) {
  if (!serverStarted) {
    serverStarted = true;

    bs.init({
      open: process.env.OPEN,
      port: config.port,
      ui: { port: config.port + 1 },
      server: {
        baseDir: config.dist,
      },
      notify: false
    });
  }
})
gulp.task('webpack', function (callback) {
  if (config.isDevelopment) {
    webpackConfig.watch = true;
  } else {
    webpackConfig.watch = false;
  }
  let webpackInstance = webpack(webpackConfig, function (err, stats) {//for some reason we need here callback...
    callback();
  })
  if (config.isDevelopment) {
    webpackInstance.compiler.plugin("done", function() {
      bs.reload()
    });
  }

})

gulp.task('watch', function () {
  gulp.watch(config.html.watch, gulp.series('html'));// build and reload html
  gulp.watch(config.css.watch, gulp.series('css'));// build and reload css
  gulp.watch(config.img.watch, gulp.series('images:copy'));// copy images
  gulp.watch(config.svgSprites.watch, gulp.series('images:svg'));// create svg sprite
})

gulp.task('setProduction', function (cb) {
  config = require('./project.config.js');
  //set production mode
  process.env.NODE_ENV = 'production';
  //clear cache
  delete require.cache[require.resolve('./project.config.js')]
  delete require.cache[require.resolve('./webpack.config.js')]
  delete require.cache[require.resolve('./postcss.config.js')]
  //set new configs for production mode
  config = require('./project.config.js');
  webpackConfig = require('./webpack.config.js');
  postcssConfig = require('./postcss.config.js');

  cb();
})


gulp.task('dev', gulp.series(gulp.parallel('html', 'css', 'webpack', 'images:copy', 'images:svg', 'copy'), gulp.parallel('serve', 'watch')))

gulp.task('build', gulp.series('setProduction', gulp.parallel('html', 'css', 'webpack', 'images:optimize', 'images:svg', 'copy')));

gulp.task('default', gulp.series('dev'))
