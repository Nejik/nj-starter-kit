const config = require('./project.config');

// const cssReporter = require('postcss-reporter');
const cssImport = require('postcss-import');
const cssNext = require('postcss-cssnext');
// const cssNano = require('cssnano');
const cssMqPacker = require('css-mqpacker');
const cssInlineSvg = require('postcss-inline-svg');


module.exports = [
  cssImport({
    root: config.root,
    // node_modules exists in resolve paths by default and we don't need to place it here
    path: [
      config.components,//to import component styles, e.g. header/header.css
      config.src,
      config.css
    ]
  }),
  cssNext,
  cssInlineSvg({path: config.src}),
  cssMqPacker({
    sort: true
  }),
  // cssReporter({
  //   filter: function (first, second, messages) {
  //     const log = messages.map(function (message,i,arr) {
  //       return `${message.plugin}: ${message.text}`;
  //     })
  //     // notifier.notify({
  //     //   title: 'css error',
  //     //   message: log.join(', '),
  //     //   icon: path.join(__dirname, 'other/styles.png'),
  //     //   sound: true,
  //     //   // wait:true
  //     // });

  //     return true;
  //   },
  //   clearMessages: false
  // })
];