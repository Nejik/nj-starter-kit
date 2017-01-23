const argv = require('yargs').argv;
const root = require('app-root-path');

const src = root.resolve('src')
const components = root.resolve('src/components')
const css = root.resolve('src/css')
const img = root.resolve('src/img')
const fonts = root.resolve('src/fonts')
const vendor = root.resolve('src/vendor')
const dist = root.resolve('dist');

const isVerbose = argv.verbose;
const isDevelopment = argv.env !== "production";

let paths = {
  dist: dist,
  publicPath: '/',

  html: {
    src: root.resolve('src/index.html'),
    dist: dist,
    watch: [root.resolve('src/**/*.html')]
  },
  root: root.toString(),
  src: src,
  components: components,
  css: css,
  img: img,
  vendor: vendor,

  isVerbose: isVerbose,
  isDevelopment: isDevelopment
}
console.log(paths.html)

module.exports = paths;