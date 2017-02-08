let config = require('./configs/project.config.js');
let webpackConfig = require('./configs/webpack.config.js');
let postcssConfig = require('./configs/postcss.config.js');

//common
const del = require('del');
const path = require('path')
const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpIf = require('gulp-if');
const plumber = require('gulp-plumber');
const newer = require('gulp-newer');
const sourcemaps = require('gulp-sourcemaps');
const notifier = require('node-notifier'); 

//html
const through = require('through2');
const ejs = require('gulp-ejs');
const assign = require('object-assign');

//styles
const postcss = require('gulp-postcss');


//images
const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');


//js
const webpack = require('webpack');

//server
let serverStarted = false;
const bs = require('browser-sync').create();
global.HMR = true;


gulp.task('clean', function () {
  return del(['dist','prod'])
})

gulp.task('setProduction', function (cb) {
  config = require('./configs/project.config.js');
  //set production mode
  process.env.NODE_ENV = 'production';
  // process.argv.push('--watch');
  //clear cache
  delete require.cache[require.resolve('./configs/project.config.js')]
  delete require.cache[require.resolve('./configs/webpack.config.js')]
  delete require.cache[require.resolve('./configs/postcss.config.js')]
  //set new configs for production mode
  config = require('./configs/project.config.js');
  webpackConfig = require('./configs/webpack.config.js');
  postcssConfig = require('./configs/postcss.config.js');

  cb();
})

gulp.task('html', function () {
  return gulp.src(config.html.src)
            .pipe(plumber({
              errorHandler: function (error) {
                notifier.notify({
                  title: config.name,
                  message: 'html error',
                  icon: path.join(__dirname, 'other/html.png'),
                  sound: true,
                  // wait:true
                });
                this.emit('end');
              }
            }))
            .pipe(ejs({},//data, A hash object where each key corresponds to a variable in your template.
            {//options, A hash object for ejs options.
              root: config.src
            },
            {//settings, A hash object to configure the plugin.
              ext: '.html'
            }
            ))
            .on('error', gutil.log)
            .pipe(gulp.dest(config.html.dist))
            .pipe(gulpIf(config.isDevelopment, bs.stream()))
})

gulp.task('css', function () {
  return gulp .src(config.css.src)
              .pipe(plumber({
                errorHandler: function (error) {
                  console.log(error.message);
                  notifier.notify({
                    title: config.name,
                    message: 'styles error',
                    icon: path.join(__dirname, 'other/postcss.png'),
                    sound: true,
                    // wait:true
                  });
                  this.emit('end');
                }
              }))
              .pipe(gulpIf(config.isDevelopment, sourcemaps.init()))
              .pipe(postcss(postcssConfig))
              .pipe(gulpIf(config.isDevelopment, sourcemaps.write()))
              .pipe(gulp.dest(config.css.dist))
              .pipe(gulpIf(config.isDevelopment, bs.stream()))
})

gulp.task('webpack', function (callback) {
  webpack(webpackConfig, function(err, stats) {
    callback();
  });
})

gulp.task('images:svg', function () {
  let svgSpriteConfig = {
                    mode : {
                        inline:true,
                        symbol: {
                          sprite: config.svgSprites.concat,
                          dest: ''
                        }
                    },
                    shape               : {
                        transform       : [
                            {svgo       : {
                              plugins : [
                                  {removeStyleElement: true},
                                  {removeAttrs: {attrs: '(stroke|fill)'}}
                              ],
                              js2svg : { 
                                pretty: config.isDevelopment,
                                indent: 2 
                              }
                            }}
                        ]
                    },
                    svg: {
                      xmlDeclaration: false, // strip out the XML attribute
                      doctypeDeclaration: false // don't include the !DOCTYPE declaration
                    }
                  }

  return gulp .src(config.svgSprites.src)
              .pipe(plumber({errorHandler: function (error) {
                console.log(error)
                this.emit('end');
              }}))
              .pipe(svgSprite(svgSpriteConfig))
              .pipe(gulp.dest(config.svgSprites.dist))
              // .pipe(gulp.dest(config.svgSprites.distCopy))
})

//todo
// now svg shouldn't be styled via style tag, use style attribute instead to save colors in sprite
//waiting for this PR https://github.com/svg/svgo/pull/592 , it will inline all css rules from <style> tag
gulp.task('images:svgColored', function () {
  let svgSpriteConfig = {
                    mode : {
                        inline:true,
                        symbol: {
                          sprite: config.svgColoredSprites.concat,
                          dest: ''
                        }
                    },
                    shape               : {
                        transform       : [
                            {svgo       : {
                              plugins : [
                                  
                              ],
                              js2svg : { 
                                pretty: config.isDevelopment,
                                indent: 2 
                              }
                            }}
                        ]
                    },
                    svg: {
                      xmlDeclaration: false, // strip out the XML attribute
                      doctypeDeclaration: false // don't include the !DOCTYPE declaration
                    }
                  }

  return gulp .src(config.svgColoredSprites.src)
              .pipe(plumber({errorHandler: function (error) {
                console.log(error)
                this.emit('end');
              }}))
              .pipe(svgSprite(svgSpriteConfig))
              .pipe(gulp.dest(config.svgColoredSprites.dist))
})
gulp.task('images:copy', function () {
  return gulp .src(config.img.src)
              .pipe(plumber({errorHandler: function (error) {
                console.log(error)
                this.emit('end');
              }}))
              .pipe(newer(config.img.dist))
              .pipe(imagemin())
              .pipe(gulp.dest(config.img.dist))
})
gulp.task('images', gulp.parallel('images:copy','images:svg','images:svgColored'))

gulp.task('watch', function () {
  gulp.watch(config.html.watch, gulp.series('html'));
  gulp.watch(config.css.watch, gulp.series('css'));

  gulp.watch(config.img.watch, gulp.series('images'));
})

gulp.task('serve', function (cb) {//serve contains js task, because of webpack integration
  const compiler = webpack(webpackConfig);

  const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: webpackConfig.stats,
  });

  compiler.plugin('done', stats => {
    if (stats.hasErrors()) {
        notifier.notify({
          title: config.name,
          message: 'Webpack error',
          icon: path.join(__dirname, 'other/js.png'),
          sound: true,
        });
      } else {
        bs.stream()
      }

      if(!serverStarted) {
        serverStarted = true;
          
        bs.init({
          open: false,
          port: process.env.PORT || 3000,
          ui: { port: Number(process.env.PORT || 3000) + 1 },
          server: {
            baseDir: config.dist,
            middleware: [
              webpackDevMiddleware,
              require('webpack-hot-middleware')(compiler),
              require('connect-history-api-fallback')(),
            ],
          },
        });
      }
  });
})











gulp.task('build', gulp.parallel('html','css','webpack','images'))

gulp.task('prod', gulp.series(gulp.parallel('clean','setProduction'), 'build'))

gulp.task('default', gulp.series('build', gulp.parallel('serve','watch')))