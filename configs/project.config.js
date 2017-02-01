const argv = require('yargs').argv;
const root = require('app-root-path');


const dist = root.resolve('dist');

const isVerbose = argv.verbose;
const isDevelopment = argv.env !== "production";

let paths = {
  src: root.resolve('src'),
  dist: dist,
  publicPath: '/',
  root: root.toString(),
  vendor: root.resolve('src/vendor'),
  fonts: root.resolve('src/fonts'),

  components: root.resolve('src/components'),

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
    dist: root.resolve('dist/img'),
    watch: root.resolve('src/img/**/*.{jpg,jpeg,png,svg,gif,webp}')
  },
  svgSprites: {
    src: 'src/img/sprites/svg/**/*.svg',
    concat: 'icons.svg',
    dist: root.resolve('dist/img'),
    // distCopy: root.resolve('dist/img/sprites/svg')
  },
  svgColoredSprites: {
    src: 'src/img/sprites/svgColored/**/*.svg',
    concat: 'iconsColored.svg',
    dist: root.resolve('dist/img'),
  },

  isVerbose: isVerbose,
  isDevelopment: isDevelopment
}

module.exports = paths;