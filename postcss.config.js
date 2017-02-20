const config = require('./project.config');

const cssImport = require('postcss-import');
const cssAssets  = require('postcss-assets');
const cssNext = require('postcss-cssnext');
const cssNano = require('cssnano');
const cssMqPacker = require('css-mqpacker');
const cssInlineSvg = require('postcss-inline-svg');
const cssReporter = require('postcss-reporter');
const cssSprite = require('postcss-sprites');

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
    cssAssets({
      basePath: config.src,
      loadPaths: [config.img.dir]
    }),
    cssInlineSvg({ 
      path: config.src,
      removeFill: true
    }),
    cssMqPacker({
      sort: true
    }),
    cssReporter({
      throwError:true
    }),
    cssSprite({
        stylesheetPath : config.css.dist,
        spritePath: config.img.dist,
        basePath: config.src,
        spritesmith: {
          padding: 5
        },
        verbose: config.isVerbose,
        filterBy: function(image) {
          if (image.url.indexOf('/sprites/') === -1) {
            return Promise.reject(new Error('Not in sprite folder.'));
          }
          return Promise.resolve();
        }
    })
  ]
}

if (!config.isDevelopment) {
    postcssConfig.plugins.push(cssNano({
                             safe:true,
                             autoprefixer:false//autoprefixer in cssNano works in delete mode, while in cssNext in add mode. Disable delete mode.
                            }))
  }
module.exports = postcssConfig;