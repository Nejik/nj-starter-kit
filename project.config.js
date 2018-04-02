const root = require('app-root-path');

const isDevelopment = process.env.NODE_ENV !== 'production';

const distString = isDevelopment ? 'build' : 'dist';
const dist = root.resolve(distString);

const config = {
  isDevelopment: isDevelopment,
  port: process.env.PORT || 3000,
  root: root,
  dist: dist,
  publicPath: '/',
  src: root.resolve('src'),
  components: root.resolve('src/components'),
  vendor: root.resolve('src/vendor'),

  copy: {
    src: [
      'src/**/*',
      '!src/js/**',
      '!src/vendor/**',
      '!src/components/**',
      '!src/**/*.html'
    ],
    dist: dist
  },

  html: {
    src: ['src/**/*.html', '!src/components/**/*.html'],
    dist: dist,
    watch: 'src/**/*.html'
  },

  css: {
    src: ['src/css/*.css'],
    dist: root.resolve(distString + '/css'),
    dir: root.resolve('src/css'),
    watch: 'src/css/**/*.css'
  },

  fonts: {
    src: 'src/**/fonts/**/*',
    dist: dist,
    watch: 'src/**/fonts/**/*'
  },

  img: {
    // src: "src/img/**/*.{jpg,jpeg,png,svg,gif,webp}",
    src: 'src/img/**/*.*',
    dir: root.resolve('src/img'),
    dist: root.resolve(distString + '/img'),
    // watch: "src/img/**/*.{jpg,jpeg,png,svg,gif,webp}"
    watch: 'src/img/**/*.*'
  },

  svgSprites: {
    src: 'src/img/sprites/svg/**/*.svg',
    concat: 'icons.svg',
    dist: root.resolve(distString + '/img'),
    watch: 'src/img/sprites/svg/**/*.svg'
  }

  // js config in webpack.config.js file
};

module.exports = config;
