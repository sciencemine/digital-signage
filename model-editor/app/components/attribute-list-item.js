import Ember from 'ember';

export default Ember.Component.extend({

  startX: null,
  startY: null,

  dragEnd(event) {
    console.log(event.pageX, this.$(".list-group-item").offset().left, event.offsetX);
    console.log(event.pageY, this.$(".list-group-item").offset().top, event.offsetY); 
    this.get('attributeDropCallback') (event.pageX - this.$().offset().left, event.pageY - Ember.$("#attribute-panel").offset().top, this.get('key'));
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
