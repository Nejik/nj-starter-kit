const argv = require('yargs').argv;
const root = require('app-root-path');

const src = root.resolve('src')
const components = root.resolve('src/components')
const cssDir = root.resolve('src/css')
const img = root.resolve('src/img')
const fonts = root.resolve('src/fonts')
const vendor = root.resolve('src/vendor')
const dist = root.resolve('dist');

const isVerbose = argv.verbose;
const isDevelopment = argv.env !== "production";

let paths = {
  src: src,
  dist: dist,
  publicPath: '/',
  root: root.toString(),
  vendor: vendor,

  components: components,

  html: {
    src: root.resolve('src/index.html'),
    dist: dist,
    watch: [root.resolve('src/**/*.html')]
  },

  css: {
    dir: cssDir,
    src: [root.resolve('src/css/styles.css')],
    dist: dist,
    watch: [root.resolve('src/**/*.css')]
  },
  img: img,

  isVerbose: isVerbose,
  isDevelopment: isDevelopment
}
console.log(paths.css)

module.exports = paths;