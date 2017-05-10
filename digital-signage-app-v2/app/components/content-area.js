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
  backgroundVideoPos: 0,
  backgroundVideoUrl: null,
  backgroundVideoKeys: null,

  init() {
    let backgroundId = this.get('data.config.backgroudVideos')[0];
    this._super(...arguments);
    this.set('keyboard', this.get('data.config.keyboard'));
    this.set('backgroundVideoUrl', this.get('data.videos')[backgroundId].full.fileIdentifier);
    this.set('backgroundVideoKeys', this.get('data.config.backgroudVideos'));
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
      this.send('pauseVideo');
    },
    goNext() {
      this.send('pauseVideo');
    },
    goPrevious() {
      this.send('pauseVideo');
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
      this.send('updateFocus', false);
      this.set('displayVideoSelect', true);
      this.set('displayVideo', false);
    },
    cycleBackground() {
      let backArrayLength = this.get('backgroundVideoKeys').length;
      let curVidPos = this.get('backgroundVideoPos');

      this.set('backgroundVideoPos', (curVidPos + 1) % backArrayLength);

      let backgroundId = this.get('data.config.backgroudVideos')[this.get('backgroundVideoPos')];
      this.set('backgroundVideoUrl', this.get('data.videos')[backgroundId].full.fileIdentifier);
    },
    doNothing() {

    },
    pauseVideo() {
      this.set('videoPlaying', !this.get('videoPlaying'));
      this.set('displayVideoSelect', !this.get('videoPlaying'));
      this.send('updateFocus', this.get('videoPlaying'));
    }
  }
});
