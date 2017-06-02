import Ember from 'ember';

export default Ember.Component.extend({

  startX: null,
  startY: null,

  dragStart(event) {
    this.set('startX', event.pageX);
    this.set('startY', event.pageY);
  },
  dragEnd(event) {console.log(this.get('startX'), this.get('startY'), event.pageX, event.pageY);
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
