/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'model-editor',
    environment: environment,
    rootURL: '',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };
  
  ENV["ember-cli-mirage"] = {
    enabled: false
  };

  ENV['ember-cli-mirage'] = {
    enabled: false
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    
  }
  
  if (environment === 'demo') {
    ENV["ember-cli-mirage"] = {
      enabled: true
    };
    
    ENV.APP.FEATURE_X = false;
    ENV.APP.FEATURE_Y = true;  
  }

  if (environment === 'demo') {
    ENV['ember-cli-mirage'] = {
      enabled: true
    }
  }

  return ENV;
};
