const argv = require('yargs').argv;
const root = require('app-root-path');

const isVerbose = argv.verbose;
const isDevelopment = argv.env !== "production";

const distString = isDevelopment ? 'dist' : 'prod';

const dist = root.resolve(distString);


let paths = {
  src: root.resolve('src'),
  dist: dist,
  publicPath: '/',
  root: root.toString(),
  vendor: root.resolve('src/vendor'),
  fonts: root.resolve('src/fonts'),

  components: root.resolve('src/components'),

  isVerbose: isVerbose,
  isDevelopment: isDevelopment,

  html: {
    src: [root.resolve('src/*.ejs'), root.resolve('src/pages/*.ejs')],
    dist: dist,
    watch: [root.resolve('src/**/*.ejs')]
  },

  css: {
    dir: root.resolve('src/css'),
    src: [root.resolve('src/css/styles.css')],
    dist: dist,
    watch: [root.resolve('src/**/*.css')]
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