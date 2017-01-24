import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  data: Ember.$.getJSON("playlist.json")
});

Router.map(function() {
  this.route('idle');
  this.route('vid-picker');
});

export default Router;
