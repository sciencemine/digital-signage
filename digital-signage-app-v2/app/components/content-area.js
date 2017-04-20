import Ember from 'ember';
import KeyboardControls from '../mixins/keyboard-controls';

export default Ember.Component.extend(KeyboardControls, {
  displayVideoSelect: true,
  displayVideo: false,
  focus: false,
  video: null,
  videoPlaying: false,
  keyboard: null,

  init() {
    this._super(...arguments);
    this.set('keyboard', this.get('data.config.keyboard'));
  },
  
  click() {
    this.send('updateFocus', false);
    this.send('showVideoSelect');
  },

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
