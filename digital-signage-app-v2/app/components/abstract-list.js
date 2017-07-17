/**
 * COMPONENT: abstract-list
 *
 * DESCRIPTION:
 *  This is the highest level list to be inherited by all othe lists.
 *  use `import AbstractList from './abstract-list'` in your lists to import this
 *  library. Then use `export default AbstractList.extend({ code here });`
 *  to extend this object in your other lists.
 *
 * CALLBACKS
 *  onSelectedCallback
 *    Callback for when an item has been selected
 *
 *  onCancelledCallback
 *    Callback for when the cancel action is invoked
 *
 *  onOverflowCallback
 *    Callback for when the list is incremented past the last element
 *
 *  onUnderflowCallback
 *    Callback for when the list is decremented past the first element
 *
 * @author Michael Fryer
 * @date 5/11/2017
 **/
import Ember from 'ember';
import KeyboardControls from '../mixins/keyboard-controls';

export default Ember.Component.extend(KeyboardControls, {
  selectedCallback: function(selected, selectedPos) {
    this.get('onSelectedCallback')(this, selected, selectedPos);
  },
  cancelCallback: function(selected) {
    this.get('onCancelledCallback') (this, selected);
  },
  inputCallback: function() {
    this.get('onInputCallback') ();
  },
  didRender() {
    if (this.$().is(':focus') !== this.get('focus')) {
      this.updateFocus(this.get('focus'));
    }
  }
});
