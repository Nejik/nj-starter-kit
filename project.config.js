const root = require('app-root-path');

const isDevelopment = process.env.NODE_ENV !== 'production'

const distString = isDevelopment ? 'build' : 'dist',
      dist = root.resolve(distString);

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
        '!src/vendor/**',
        '!src/js/**',
        '!src/components/**',
        '!src/**/*.html'
      ],
      dist: dist
  },

  html: {
      src: [
        'src/**/*.html',
        '!src/components/**/*.html'
      ],
      dist: dist,
      watch: 'src/**/*.html'
  },

  css: {
      src: 'src/css/styles.css',
      concat: 'styles.css',
      dist: root.resolve(distString+'/css'),
      dir: root.resolve('src/css'),
      watch: 'src/**/*.css'
  },

  img: {
      src: 'src/img/**/*.{jpg,jpeg,png,svg,gif,webp}',
      dir: root.resolve('src/img'),
      dist: root.resolve(distString+'/img'),
      watch: 'src/img/**/*.{jpg,jpeg,png,svg,gif,webp}'
  },

  svgSprites: {
      src: 'src/img/sprites/svg/**/*.svg',
      concat: 'icons.svg',
      dist: root.resolve(distString+'/img'),
      watch: 'src/img/sprites/svg/**/*.svg'
  },

  //js config in webpack.config.js file
}

module.exports = config;
