/**
 * 
 * @pre has been passed a parameter called `startActive` to determine if the
 *   list should start as the active list.
 * @pre has been passed a parameter called `class` to set the class
 * @pre has been passed an action called `onSelectedCallback`
 * @pre has been passed an action called `onOverflowCallback`
 * @pre has been passed an action called `onUnderflowCallback`
 * @pre has been passed an action called `onCancelledCallback`
 * 
 * @author Michael Fryer
 * @date 3/11/2017
 */
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [],

  init() {
    this._super(...arguments);
  },
  keyPress(event) {
    console.log(String.fromCharCode(event.keyCode));
  },
  actions: {
    selectedCallback(sender, selected) {
      this.get('onSelectedCallback')(this, selected);
    },
    overflowCallback(sender) {
      this.get('onOverflowCallback')(this);
    },
    underflowCallback(sender) {
      this.get('onUnderflowCallback')(this);
    },
    cancelCallback(sender, selected) {
      this.get('onCancelledCallback')(this, selected);
    },
    goPrevious() {
      console.log('goPrevious() needs to be imlemented in subcomponent');
    },
    goNext() {
      console.log('goNext() needs to be imlemented in subcomponent');
    },
    select() {
      console.log('select() needs to be imlemented in subcomponent');
    },
    cancel() {
      console.log('cancel() needs to be imlemented in subcomponent');
    }
  }
});
