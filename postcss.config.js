const config = require('./configs/project.config');

const cssImport = require('postcss-import');
const cssNext = require('postcss-cssnext');
const cssNano = require('cssnano');
const cssMqPacker = require('css-mqpacker');
const cssInlineSvg = require('postcss-inline-svg');
const cssReporter = require('postcss-reporter');


let postcssConfig = [
  cssImport({
    root: config.root,
    path: [// node_modules exists in resolve paths by default and we don't need to place it here
      config.components,//to import component styles, e.g. header/header.css
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
  })
]

if (!config.isDevelopment) {
    postcssConfig.push(cssNano({
                             safe:true,
                             autoprefixer:false//autoprefixer in cssNano works in delete mode, while in cssNext in add mode. Disable delete mode.
                            }))
  }
module.exports = postcssConfig;