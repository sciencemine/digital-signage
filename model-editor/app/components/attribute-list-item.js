import Ember from 'ember';

export default Ember.Component.extend({
  key: null,
  
  actions: {
    updateModal() {
      this.get('updateModalCallback') ('.attributes', this.get('id'));
    },
    deleteAttribute() {
      this.get('deleteAttributeCallback') (this.get('key'));
    }
  }
});
