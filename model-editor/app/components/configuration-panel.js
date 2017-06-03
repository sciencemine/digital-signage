import Ember from 'ember';

export default Ember.Component.extend({
  expanded: true,
  prefix: "config",
  path: ".config",

  actions: {
    toggleView() {
      this.set('expanded', !this.get('expanded'));

      this.get('configurationExpandedCallback') (this.get('expanded'));
    }
  }
});
