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
  focus: false,
  
  /**
   * Called from keyPress event when the select button is pressed
   *
   * @param{event} event
   */
  select: function(event) {
    console.log('select() needs to be implemented in subcomponent', event);
  },
  /**
   * Called from keyPress event when the previous button is pressed
   *
   * @param{event} event
   */
  goPrevious: function(event) {
    console.log('goPrevious() needs to be implemented in subcomponent', event);
  },
  /**
   * Called from keyPress event when the cancel button is pressed
   *
   * @param{event} event
   */
  cancel: function(event) {
    console.log('cancel() needs to be implemented in subcomponent', event);
  },
  /**
   * Called from keyPress event when the next button is pressed
   *
   * @param{event} event
   */
  goNext: function(event) {
    console.log('goNext() needs to be implemented in subcomponent', event);
  },
  /**
   * Called from didRender and changeFocusObserver. updates the focus of the 
   * DOM to this element
   *
   */
  updateFocus: function() {
    console.log('UpdateFocus() needs to be implemented.');
  },
  
  //adds an observer for the parameter that was passed. fires when it is changed
  //up a level. allows for change of focus to the lists
  changeFocusObserver: Ember.observer('focus', function() {
    this.updateFocus(this.get('focus'));
  }),

  //checks input on key down to see if it is valid
  //This needs to be pulled from the model later, not be hard coded
  keyDown(event) {
    if (this.get('focus')) {
      switch (String.fromCharCode(event.keyCode).toLowerCase()) {
        case this.get('keyboard.select').toLowerCase():
          this.select(event);
          break;
        case this.get('keyboard.previous').toLowerCase():
          this.goPrevious(event);
          break;
        case this.get('keyboard.cancel').toLowerCase():
          this.cancel(event);
          break;
        case this.get('keyboard.next').toLowerCase():
          this.goNext(event);
          break;
      }
    }
  }
});
