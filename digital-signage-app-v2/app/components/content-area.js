import Ember from 'ember';

export default Ember.Component.extend({
  displayVideoSelect: true,
  displayVideo: false,
  focus: false,
  video: null,
  videoPlaying: false,

  //Sends an action after the html has been rendered. Necessary to allow access
  //to the component's wrapper div
  didRender() {
    this.send('updateFocus', this.get('focus'));
  },
  //checks input on key down to see if it is valid
  //This needs to be pulled from the model later, not be hard coded
  keyDown(event) {
    if (this.get('focus')) {
      switch (String.fromCharCode(event.keyCode).toLowerCase()) {
        case this.get('data.config.keyboard.select'):
          this.send('select');
          break;
        case this.get('data.config.keyboard.previous'):
          //this.send('goPrevious');
          break;
        case this.get('data.config.keyboard.cancel'):
          this.send('cancel');
          break;
        case this.get('data.config.keyboard.next'):
          //this.send('goNext');
          break;
      }
    }
  },
  click() {
    this.send('updateFocus', false);
    this.send('showVideoSelect');
  },
  //adds an observer for the parameter that was passed. fires when it is changed
  //up a level. allows for change of fovus to the lists
  changeFocusObserver: Ember.observer('focus', function() {
    this.send('updateFocus', this.get('focus'));
  }),

  actions: {
    select() {
      this.set('videoPlaying', false);
      this.send('updateFocus', false);
      this.send('showVideoSelect');
    },
    cancel() {
      this.set('videoPlaying', !this.get('videoPlaying'));
    },
    videoSelected(sender, selected) {
      this.set('video', this.get('data.config.modelIdentifier') + '/' + selected.fileIdentifier);
      this.set('displayVideo', true);
      this.set('videoPlaying', true);
      this.send('hideVideoSelect');
      this.send('updateFocus', true);
    },
    videoClicked(selected) {
      if (selected.get('url') === this.get('video')) {
        this.set('videoPlaying', !this.get('videoPlaying'));
      }
      else {
        this.set('video', selected.get('url'));
        this.set('displayVideo', true);
        this.set('videoPlaying', true);
        this.send('hideVideoSelect');
        this.send('updateFocus', true);
      }
    },
    showVideoSelect() {
      this.set('displayVideoSelect', true);
    },
    hideVideoSelect() {
      this.set('displayVideoSelect', false);
    },
    //sets the focus to the list if focus is true otherwise blurs it
    updateFocus(param) {
      if (param) {
        this.$().attr('tabindex', 2);
        this.$().focus();
      }//if
      else {
        this.$().attr('tabindex', -1);
        this.$().blur();
      }//else
      
      this.set('focus', param);
    }
  }
});
