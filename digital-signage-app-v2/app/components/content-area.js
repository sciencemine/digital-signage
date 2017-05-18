import Ember from 'ember';
import KeyboardControls from '../mixins/keyboard-controls';

export default Ember.Component.extend(KeyboardControls, {
  displayVideoSelect: false,
  displayVideoSelectTimeout: null,
  displayVideo: false,
  focus: false,
  video: null,
  videoPlaying: false,
  keyboard: null,
  backgroundVideoPos: 0,
  backgroundVideoUrl: null,
  backgroundVideoKeys: null,

  init() {
    let backgroundId = this.get('data.config.backgroundVideos')[0];
    this._super(...arguments);
    this.set('keyboard', this.get('data.config.keyboard'));
    this.set('backgroundVideoUrl', this.get('data.videos')[backgroundId].full.fileIdentifier);
    this.set('backgroundVideoKeys', this.get('data.config.backgroundVideos'));
    this.send('showVideoSelect');
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

      this.send('resetTimeout');
    },
    cancel() {
      this.send('pauseVideo');

      this.send('resetTimeout');
    },
    goNext() {
      this.send('pauseVideo');

      this.send('resetTimeout');
    },
    goPrevious() {
      this.send('pauseVideo');

      this.send('resetTimeout');
    },
    videoSelected(videoData) {
      if (videoData) {
        var url = videoData.full.fileIdentifier;
        //strips off media fragments fix by sending vid object data from model
        this.set('video', this.get('data.config.modelIdentifier') + '/' + url);
        this.set('displayVideo', true);
        this.set('videoPlaying', true);
        this.send('hideVideoSelect');
        this.send('updateFocus', true);
      }
      else {
        this.send('pauseVideo');
      }
    },
    showVideoSelect() {
      this.set('displayVideoSelect', true);

      this.send('resetTimeout');
    },
    hideVideoSelect() {
      this.set('displayVideoSelect', false);

      clearTimeout(this.get('displayVideoSelectTimeout'));
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
    videoEnded() {
      this.send('updateFocus', false);
      this.send('showVideoSelect');
      this.set('displayVideo', false);
    },
    cycleBackground() {
      let backArrayLength = this.get('backgroundVideoKeys').length;
      let curVidPos = this.get('backgroundVideoPos') + backArrayLength;

      this.set('backgroundVideoPos', (curVidPos + 1) % backArrayLength);

      let backgroundId = this.get('data.config.backgroundVideos')[this.get('backgroundVideoPos')];
      this.set('backgroundVideoUrl', this.get('data.videos')[backgroundId].full.fileIdentifier);
    },
    doNothing() {

    },
    pauseVideo() {
      this.set('videoPlaying', !this.get('videoPlaying'));
      this.set('displayVideoSelect', !this.get('videoPlaying'));
      this.send('updateFocus', this.get('videoPlaying'));
    },
    resetTimeout() {
      let component = this;

      clearTimeout(this.get('displayVideoSelectTimeout'));

      let timeout = setTimeout(() => {
                      component.send('hideVideoSelect');
                      component.send('updateFocus', true);
                    }, this.get('data.config.ui.idle') * 1000);

      this.set('displayVideoSelectTimeout', timeout);
    }
  }
});
