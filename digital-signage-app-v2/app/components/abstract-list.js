/**
 * COMPONENT: abstract-list
 *
 * DESCRIPTION:
 *  This is the highest level list to be inherited by all othe lists.
 *  use `import AbstractList from './abstract-list'` in your lists to import this
 *  library. Then use `export default AbstractList.extend({ /* code here /* });
 *  to extend this object in your other lists.
 *
 * PARAMETERS:
 *  focus
 *    Determines if the list should be initialized with focus or not
 * 
 *  class
 *    Applies a css class to the component's wrapper div
 *
 * CALLBACKS
 *  onSelectedCallback
 *    Callback for when an item has been selected
 *
 *  onCancelledCallback
 *    Callback for when an item has been selected
 *
 *  onOverflowCallback
 *    Callback for when an item has been selected
 *
 *  onUnderflowCallback
 *    Callback for when an item has been selected
 *
 * @author Michael Fryer
 * @date 3/11/2017
 */
import Ember from 'ember';
import KeyboardControls from '../mixins/keyboard-controls';

export default Ember.Component.extend(KeyboardControls, {
  init() {
    this._super(...arguments);
  },
  actions: {
    selectedCallback(selected) {
      this.get('onSelectedCallback')(this, selected);
    },
    overflowCallback() {
      this.get('onOverflowCallback')(this);
    },
    underflowCallback() {
      this.get('onUnderflowCallback')(this);
    },
    cancelCallback(selected) {
      this.get('onCancelledCallback')(this, selected);
    },
    //sets the focus to the list if focus is true otherwise blurs it
    updateFocus(param) {
      if (param) {
        this.$().attr('tabindex', 1);
        this.$().focus();
      }//if
      else {
        this.$().attr('tabindex', -1);
        this.$().blur();
      }//else
    }
  }
});
