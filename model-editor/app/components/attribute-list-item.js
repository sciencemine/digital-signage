import Ember from 'ember';

export default Ember.Component.extend({
  key: null,
  
  actions: {
    updateModal() {
      this.get('updateModalCallback') ('.attributes', this.get('key'));
    },
    deleteAttribute() {
      this.get('deleteAttributeCallback') (this.get('key'));
    }
  }
});
