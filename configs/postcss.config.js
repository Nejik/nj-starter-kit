const config = require('./project.config');

const notifier = require('node-notifier');  

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
    filter: function (object, index, third) {
    //   const log = messages.map(function (message,i,arr) {
    //     return `${message.plugin}: ${message.text}`;
    //   })
    //   // notifier.notify({
    //   //   title: 'css error',
    //   //   message: log.join(', '),
    //   //   icon: path.join(__dirname, 'other/styles.png'),
    //   //   sound: true,
    //   //   // wait:true
    //   // });
      
      if (object.type !== 'dependency') {
          notifier.notify({
            title: 'CSS error',
            // message: 'css eror',
            // icon: path.join(__dirname, 'other/styles.png'),
            sound: true,
            // wait:true
          });
        return true;
      }
    },
    clearReportedMessages : true
  })
]

if (!config.isDevelopment) {
    postcssConfig.push(cssNano({
                             safe:true,
                             autoprefixer:false//autoprefixer in cssNano works in delete mode, while in cssNext in add mode. Disable delete mode.
                            }))
  }
module.exports = postcssConfig;