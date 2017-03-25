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
  isActive: null,
  classNames: [],
  currentlySelected: null,

  init() {
    this._super(...arguments);
    this.set('isActive', this.get('startActive'));
  }, 
  actions: {
    selectedCallback(sender) {
      this.set('currentlySelected', sender);
      this.get('onSelectedCallback')(this, this.get('currentlySelected'));
    },
    overflowCallback(sender) {
      this.get('onOverflowCallback')(this, this.get('currentlySelected'));
      this.set('currentlySelected', null);
    },
    underflowCallback(sender) {
      this.get('onUnderflowCallback')(this, this.get('currentlySelected'));
      this.set('currentlySelected', null);
    },
    cancelCallback(sender) {
      this.set('isActive', false);
      this.set('currentlySelected', null);
      this.get('onCancelledCallback')(this, this.get('currentlySelected'));
    }
  }
});
