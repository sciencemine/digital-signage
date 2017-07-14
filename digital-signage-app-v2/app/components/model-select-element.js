import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "button",
  classNames: [ "list-group-item" ],
  
  muted: true,
  
  mouseEnter() {
    this.set('muted', false);
  },
  mouseLeave() {
    this.set('muted', true);
  },
  actions: {
    doNothing() {
      
    }
  }
});
