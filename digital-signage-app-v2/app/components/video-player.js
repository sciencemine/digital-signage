/*
COMPONENT: video-player

Parameters:
  url
	If startUrl is passed in, load the video at that url
	immediately. Otherwise, leave video blank until setUrl()
	is called.

  looping
	Should the video loop when it completes playback
	default: false
	
  playing
	Should the video play
	default: true

  muted
	Mute the video
	default: true

Callbacks:
  onEndedCallback(sender)
	This is an action that will be passed in as a parameter.
	Call this action using this.get('onCompletedCallback')()
	when the video has played to completion and and looping is
	disabled.
  onClickCallback
  onHoverCallback
*/

import Ember from 'ember';

export default Ember.Component.extend({
	url: null,
	looping: false,
	playing: true,
	muted: true,
	highlightedStyle: '',

	click(event) {
		this.get('onClickCallback') (this.get('videoPos'));
		event.stopPropagation();
	},
	mouseEnter() {
		this.get('onHoverCallback') (this.get('videoPos'));
	},
  willClearRender() {
    this.set('playingObserver', null);
  },
	playingObserver: Ember.observer('playing', function() {
    var p = this.get("playing");
    var videoElement = this.$('video')[0];
    if (videoElement) {
      if (p) {
        videoElement.play();
      }
      else {
        videoElement.pause();
      }
    }
    else {
      console.log("No video element found!");
    }
  }),
  actions: {
  	ended() {
      if (this.$('video')) {
        if (this.get('looping')) {
          var videoElement = this.$('video')[0];
          
          if (videoElement) {
            videoElement.play();
          }
        }
        else {
          this.get('onEndedCallback') (this.get('videoPos'));
        }
      }
  	},
    play() {
      if (this.$('video')) {
        if (this.get('playing')) {
          var videoElement = this.$('video')[0];
          
          if (videoElement) {
            videoElement.play();
          }
        }
      }
    }
  }
});
