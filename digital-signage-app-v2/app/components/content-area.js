import Ember from 'ember';
import KeyboardControls from '../mixins/keyboard-controls';

export default Ember.Component.extend(KeyboardControls, {
  displayVideoSelect: true,
  displayVideo: false,
  focus: false,
  video: null,
  videoPlaying: false,
  keyboard: null,
  videoHistory: [],

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
      this.set('displayVideoSelect', !this.get('videoPlaying'));
      this.send('updateFocus', this.get('videoPlaying'));
    },
    videoSelected(sender, selected) {
      this.set('video', this.get('data.config.modelIdentifier') + '/' + selected.full.fileIdentifier);
      this.set('displayVideo', true);
      this.set('videoPlaying', true);
      this.send('hideVideoSelect');
      this.send('updateFocus', true);
    },
    //sets the focus to the list if focus is true otherwise blurs it
    videoClicked(selected) {
      var url = selected.get('url');

      if (url === this.get('video')) {
        this.set('videoPlaying', !this.get('videoPlaying'));
        this.send('updateFocus', this.get('videoPlaying'));
        this.set('displayVideoSelect', !this.get('videoPlaying'));
      }
      else {
        //strips off media fragments fix by sending vid object data from model
        this.set('video', url);
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
    },
    //sender is a video object? url? video player object?
    //assuming video object
    videoEnded(sender) {
      let oldVideoHistory = this.get('videoHistory');
      oldVideoHistory.push(sender);
      this.set('videoHistory', oldVideoHistory);
    }
  }
});
