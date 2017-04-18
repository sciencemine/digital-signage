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

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
  },
    //Sends an action after the html has been rendered. Necessary to allow access
  //to the component's wrapper div
  didRender() {
    this.send('updateFocus');
  },

  //checks input on key down to see if it is valid
  //This needs to be pulled from the model later, not be hard coded
  keyDown(event) {
      switch (String.fromCharCode(event.keyCode).toLowerCase()) {
        case this.get('keyboard.select'):
          this.send('select', event);
          break;
        case this.get('keyboard.previous'):
          this.send('goPrevious', event);
          break;
        case this.get('keyboard.cancel'):
          this.send('cancel', event);
          break;
        case this.get('keyboard.next'):
          this.send('goNext', event);
          break;
      }
  },
  //adds an observer for the parameter that was passed. fires when it is changed
  //up a level. allows for change of fovus to the lists
  changeFocusObserver: Ember.observer('focus', function() {
    this.send('updateFocus');
  }),
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
    select() {
      console.log('select() needs to be imlemented in subcomponent');
    },
    goPrevious() {
      console.log('goPrevious() needs to be imlemented in subcomponent');
    },
    cancel() {
      console.log('cancel() needs to be imlemented in subcomponent');
    },
    goNext() {
      console.log('goNext() needs to be imlemented in subcomponent');
    },
    //sets the focus to the list if focus is true otherwise blurs it
    updateFocus() {
      if (this.get('focus')) {
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
