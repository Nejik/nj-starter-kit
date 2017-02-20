const path = require('path');
const argv = require('yargs').argv;
const root = require('app-root-path');

const pkg = require('./package.json');

const isVerbose = argv.verbose;
let isDevelopment = process.env.NODE_ENV !== "production" && argv.env !== "production";
const port = process.env.PORT || 3000;

const distString = isDevelopment ? 'dist' : 'prod';
const dist = root.resolve(distString);


let paths = {
  name: pkg.name,
  src: root.resolve('src'),
  dist: dist,
  publicPath: '/',
  root: root.toString(),
  vendor: root.resolve('src/vendor'),
  fonts: root.resolve('src/fonts'),
  
  components: root.resolve('src/components'),
  
  isVerbose: isVerbose,
  isDevelopment: isDevelopment,
  port: port,
  
  html: {
    src: [root.resolve('src/*.ejs'), root.resolve('src/pages/**/*.ejs')],
    dist: dist,
    watch: [root.resolve('src/**/*.ejs')]
  },
  
  css: {
    dir: root.resolve('src/css'),
    src: [root.resolve('src/css/styles.css')],
    concatGulp: 'gulp.styles.css',//final name of css file builed by gulp
    concatWebpack: 'webpack.styles.css',//final name of css file builed by webpack
    concatProd: 'styles.css', 
    dist: dist,
    webpackStyleName: 'webpack.styles.css',//temporary file with builded styles from webpack, after build it will be merged in main styles files
    watch: [root.resolve('src/**/*.css')]
  },
  
  js: {
    src: [root.resolve('src/app.js')],
    concat: 'bundle.js',//final name of builded js file
    dist: dist
  },
  
  img: {
    dir: root.resolve('src/img'),
    src: root.resolve('src/img/**/*.{jpg,jpeg,png,svg,gif,webp}'),
    dist: root.resolve(distString+'/img'),
    watch: root.resolve('src/img/**/*.{jpg,jpeg,png,svg,gif,webp}')
  },
  
  svgSprites: {
    src: 'src/img/sprites/svg/**/*.svg',
    concat: 'icons.svg',
    dist: root.resolve(distString+'/img'),
  },
  
  svgColoredSprites: {
    src: 'src/img/sprites/svgColored/**/*.svg',
    concat: 'iconsColored.svg',
    dist: root.resolve(distString+'/img'),
  }
}

module.exports = paths;