import Ember from 'ember';

export default Ember.Component.extend({
  dragStart(event) {
    this.set('startX', event.pageX);
    this.set('startY', event.pageY);
  },
  dragEnd(event) {
    this.get('attributeDropCallback') (event.clientX, event.clientY, this.get('key'));
  },
  actions: {
    updateModal() {
      this.get('updateModalCallback') (this.get('key'));
    },
    deleteAttribute() {
      this.get('deleteAttributeCallback') (this.get('key'));
    }
  }
});
