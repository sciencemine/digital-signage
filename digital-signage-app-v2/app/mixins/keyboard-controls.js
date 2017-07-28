/**
 * MIXIN: keyboard-controls
 *
 * DESCRIPTION:
 *  Keyboard controller for the application. captures the keypress event and calls
 *  the select, cancel, previous, and next actions depending on what is set in
 *  the model
 *
 * @author Michael Fryer
 * @date 5/11/2017
 */
import Ember from 'ember';

export default Ember.Mixin.create({
  keyboard: null,
  focus: false,

  select: function(event) {
    console.log('select() needs to be implemented in subcomponent', event);
  },
  goPrevious: function(event) {
    console.log('goPrevious() needs to be implemented in subcomponent', event);
  },
  cancel: function(event) {
    console.log('cancel() needs to be implemented in subcomponent', event);
  },
  goNext: function(event) {
    console.log('goNext() needs to be implemented in subcomponent', event);
  },
  updateFocus: function(param) {
    if (Ember.isNone(this.$())) {
      return;
    }
    
    if (param) {
      this.$().attr('tabindex', 10);
      this.$().focus();
    }
    else {
      this.$().attr('tabindex', -10);
      this.$().blur();
    }
  },
  
  changeFocusObserver: Ember.observer('focus', function() {
    this.updateFocus(this.get('focus'));
  }),

  //checks input on key down to see if it is valid
  keyDown(event) {
    if (this.$().is(':focus')) {
      let keyboard = this.get('keyboard');
      switch (String.fromCharCode(event.keyCode).toLowerCase()) {
        case keyboard.select.toLowerCase():
          this.select(event);
          break;
        case keyboard.previous.toLowerCase():
          this.goPrevious(event);
          break;
        case keyboard.cancel.toLowerCase():
          this.cancel(event);
          break;
        case keyboard.next.toLowerCase():
          this.goNext(event);
          break;
      }
    }
  }
});
