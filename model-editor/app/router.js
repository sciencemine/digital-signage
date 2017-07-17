import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('modelSelect', {
    path: "exhibit-selection"
  });
  this.route('modelEdit', {
    path: "exhibit-editor"
  });
});

export default Router;
