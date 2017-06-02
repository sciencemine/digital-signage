import Ember from 'ember';

export default Ember.Component.extend({

  startX: null,
  startY: null,

  dragEnd(event) {
    this.get('attributeDropCallback') (event.clientX, event.clientY, this.get('key'));
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
