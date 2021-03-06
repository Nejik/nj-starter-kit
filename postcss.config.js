let config = require("./project.config.js");

const cssImport = require("postcss-import");
const cssAssets = require("postcss-assets");
const cssNext = require("postcss-cssnext");
const cssNested = require("postcss-nested");
const cssNano = require("cssnano");
const cssMqPacker = require("css-mqpacker");
const cssInlineSvg = require("postcss-inline-svg");
const cssSprite = require("postcss-sprites");

// console.log(config.src);
let postcssConfig = {
  plugins: [
    cssImport({
      root: config.root.toString(),
      path: [
        // node_modules exists in resolve paths by default and we don't need to place it here
        config.components,
        config.src,
        config.css.dir
      ]
    }),
    cssNested(),
    cssNext({
      features: {
        nesting: false
      }
    }),
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
    cssSprite({
      stylesheetPath: config.css.dist,
      spritePath: config.img.dist,
      basePath: config.src,
      spritesmith: {
        padding: 2
      },
      // eslint-disable-next-line
      verbose: config.isDevelopment ? false : true,
      filterBy: function(image) {
        if (image.url.indexOf("/sprites/") === -1) {
          return Promise.reject(new Error("Not in sprite folder."));
        }
        return Promise.resolve();
      }
    })
  ]
};

if (!config.isDevelopment) {
  postcssConfig.plugins.push(
    cssNano({
      safe: true,
      autoprefixer: false //autoprefixer in cssNano works in delete mode, while in cssNext in add mode. Disable delete mode.
    })
  );
}
module.exports = postcssConfig;
