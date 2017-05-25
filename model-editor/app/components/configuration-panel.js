import Ember from 'ember';

export default Ember.Component.extend({
  expanded: true,

  actions: {
    toggleExpanded() {
      this.set('expanded', !this.get('expanded'));
    }
  }
});
