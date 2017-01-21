const argv = require('yargs').argv;
const root = require('app-root-path');

const src = root.resolve('src')
const css = root.resolve('src/css')
const img = root.resolve('src/img')
const fonts = root.resolve('src/fonts')
const vendor = root.resolve('src/vendor')
const dist = root.resolve('dist');

const isVerbose = argv.verbose;
const isDevelopment = argv.env !== "production";

let paths = {
  root: root.toString(),
  src: src,
  css: css,
  img: img,
  vendor: vendor,
  dist: dist,
  publicPath: '/',

  isVerbose: isVerbose,
  isDevelopment: isDevelopment
}

module.exports = paths;