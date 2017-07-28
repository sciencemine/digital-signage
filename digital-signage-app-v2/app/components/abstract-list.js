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
  modelData: Ember.inject.service(),
  
  selectedCallback: function(selectedId) {
    this.get('onSelectedCallback') (selectedId);
  },
  cancelCallback: function(selected) {
    this.get('onCancelledCallback') (selected);
  },
  inputCallback: function() {
    this.get('onInputCallback') ();
  },
  init() {
    this._super(...arguments);
    
    this.set('keyboard', this.get('modelData.keyboard'));
  },
  didRender() {
    let focus = this.get('focus');

    if (this.$().is(':focus') !== focus) {
      this.updateFocus(focus);
    }
  }
});
