import Ember from 'ember';

export default Ember.Mixin.create({
  didRender() {
    this.send('updateFocus', this.get('focus'));
  },

  //checks input on key down to see if it is valid
  //This needs to be pulled from the model later, not be hard coded
  keyDown(event) {
    if (this.get('focus')) {
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
    }
  },
  //adds an observer for the parameter that was passed. fires when it is changed
  //up a level. allows for change of fovus to the lists
  changeFocusObserver: Ember.observer('focus', function() {
    this.send('updateFocus', this.get('focus'));
  }),
  actions: {
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
    updateFocus(param) {
      console.log('Update focus needs to be implemented.');
    }
  }
});
