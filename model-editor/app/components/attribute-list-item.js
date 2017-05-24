import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    updateModal() {
      this.get('updateModalCallback') ('.attributes', this.get('id'));
    }
  }
});
