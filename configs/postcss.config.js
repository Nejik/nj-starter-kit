const cssReporter = require('postcss-reporter');
const cssImport = require('postcss-import');
const cssNext = require('postcss-cssnext');
const cssNano = require('cssnano');
const cssMqPacker = require('css-mqpacker');
const cssInlineSvg = require('postcss-inline-svg');

const projectConfig = require('../config/project.config');

module.exports = (webpack) => [
  cssImport({
    addDependencyTo: webpack,
    root: projectConfig.srcDir,
    // node_modules exists in resolve paths by default and we don't need to place it here
    path: [
      projectConfig.cssDir
    ]
  }),
  cssNext,
  cssInlineSvg({path: projectConfig.srcDir}),
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