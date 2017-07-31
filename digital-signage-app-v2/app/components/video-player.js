import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Component.extend({
  modelData: service(),
  
	looping: false,
	playing: true,
	muted: true,
	highlightedStyle: '',
  startingTime: 0,
  videoPos: null,
  videoId: null,
  isTeaser: true,

  _makeUrl(obj) {
    let url;
    
    url = (obj.isUrl ? '' : this.get('modelData.modelIdentifier') + '/');
    url = url + obj.fileIdentifier;
    
    return url;
  },
  url: Ember.computed('videoId', 'isTeaser', function() {
    let vidId = this.get('videoId');
    
    if (Ember.isBlank(vidId)) {
      return '';
    }
    
    let video = this.get(`modelData.videos.${this.get('videoId')}`);
    
    if (Ember.isNone(video)) {
      return '';
    }
    
    return (this.get('isTeaser') ? this._makeUrl(video.teaser) : this._makeUrl(video.full));
  }),
	click(event) {
    let vid = this.$('video')[0];
    
		this.get('onClickCallback') (this.get('videoId'), vid ? vid.currentTime : null, vid ? vid.duration : null);
    
		event.stopPropagation();
	},
	mouseEnter() {
		this.get('onHoverCallback') (this.get('videoPos'));
	},
	playingObserver: Ember.observer('playing', function() {
    let p = this.get('playing');
    let videoElement = this.$('video')[0];

    if (videoElement) {
      if (p) {
        videoElement.play();
      }
      else {
        videoElement.pause();
      }
    }
  }),
  actions: {
  	ended() {
      if (this.$('video')) {
        let videoElement = this.$('video')[0];
          
        if (this.get('looping')) {
          if (videoElement) {
            videoElement.play();
          }
        }
        else {
          this.get('onEndedCallback') (this.get('videoId'), videoElement ? videoElement.duration : null);
        }
      }
  	},
    play() {
      if (this.$('video')) {
        if (this.get('playing')) {
          let videoElement = this.$('video')[0];
          
          if (videoElement) {
            videoElement.play();
          }
        }
      }
    }
  }
});
