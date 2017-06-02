import Ember from 'ember';

export default Ember.Component.extend({
  key: null,

  dragEnd(event) {
    this.get('attributeDropCallback') (event.pageX, event.pageY, this.get('key'));
  },

  actions: {
    updateModal() {
      this.get('updateModalCallback') ('.attributes', this.get('key'));
    },
    deleteAttribute() {
      this.get('deleteAttributeCallback') (this.get('key'));
    }
  }
});
