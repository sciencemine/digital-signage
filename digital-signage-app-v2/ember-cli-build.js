/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    'ember-bootstrap': {
      bootstrapVersion: 3,
      importBootstrapFont: true,
      importBootstrapCSS: false
    },
    sassOptions: {
      importedPaths: [
        'app/styles'
      ]
    }
  });

  app.import('vendor/bootstrap/affix.js');
  app.import('vendor/bootstrap/button.js');
  app.import('vendor/bootstrap/dropdown.js');

  //order matters
  app.import('vendor/bootstrap/tooltip.js');
  app.import('vendor/bootstrap/popover.js');

  return app.toTree();
};
