const config = require('./project.config');

const cssImport = require('postcss-import');
const cssNext = require('postcss-cssnext');
const cssNano = require('cssnano');
const cssMqPacker = require('css-mqpacker');
const cssInlineSvg = require('postcss-inline-svg');
const cssReporter = require('postcss-reporter');
const sprite = require('postcss-sprites');

let postcssConfig = {
  //just comment: in webpack we should sent object with field plugins and array of plugins, but in gulp we should send only array, not object
  plugins: [
    cssImport({
      root: config.root,
      path: [// node_modules exists in resolve paths by default and we don't need to place it here
        config.components,
        config.src,
        config.css.dir
      ]
    }),
    cssNext,
    cssInlineSvg({ path: config.src }),
    cssMqPacker({
      sort: true
    }),
    cssReporter({
      throwError:true
    }),
    sprite({
        stylesheetPath : config.css.dist,
        spritePath: config.img.dist,
        basePath: config.src,
        spritesmith: {
          padding: 5
        }
    })
  ]
}
console.log(config.img.dir)

if (!config.isDevelopment) {
    postcssConfig.plugins.push(cssNano({
                             safe:true,
                             autoprefixer:false//autoprefixer in cssNano works in delete mode, while in cssNext in add mode. Disable delete mode.
                            }))
  }
module.exports = postcssConfig;