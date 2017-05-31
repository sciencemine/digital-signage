import Ember from 'ember';

export default Ember.Component.extend({
  expanded: true,
  path: "",

  actions: {
    toggleView() {
      this.set('expanded', !this.get('expanded'));
    }
  }
});
