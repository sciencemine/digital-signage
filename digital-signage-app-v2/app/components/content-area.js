import Ember from 'ember';
import KeyboardControls from '../mixins/keyboard-controls';

export default Ember.Component.extend(KeyboardControls, {
  displayVideoSelect: false,
  displayVideoSelectTimeout: null,
  displayVideo: false,
  video: null,
  videoPlaying: false,
  keyboard: null,
  backgroundVideoPos: 0,
  backgroundVideoUrl: null,
  backgroundVideoKeys: null,
  selectionVideos: [],
  afterVideoListData: null,
  showAfterVideoList: true,

  showVideoSelect: function() {
    this.set('displayVideoSelect', true);

    this.send('resetTimeout');
  },
  hideVideoSelect: function() {
    this.set('displayVideoSelect', false);

    clearTimeout(this.get('displayVideoSelectTimeout'));
  },
  pauseVideo: function() {
    this.set('videoPlaying', !this.get('videoPlaying'));
    this.set('displayVideoSelect', !this.get('videoPlaying'));
    this.set('focus', this.get('videoPlaying'));
  },
  select: function() {
    this.set('videoPlaying', false);
    this.set('focus', false);
    this.showVideoSelect();

    this.send('resetTimeout');
  },
  cancel: function() {
    this.pauseVideo();

    this.send('resetTimeout');
  },
  goNext: function() {
    this.pauseVideo();

    this.send('resetTimeout');
  },
  goPrevious: function() {
    this.pauseVideo();

    this.send('resetTimeout');
  },
  updateFocus: function(param) {
    if (param) {
      this.$().attr('tabindex', 2);
      this.$().focus();
    }//if
    else {
      this.$().attr('tabindex', -2);
      this.$().blur();
    }//else
  },

  init() {
    let backgroundId = this.get('data.config.backgroundVideos')[0];   
    this._super(...arguments);
    this.set('keyboard', this.get('data.config.keyboard'));
    this.set('backgroundVideoUrl', this.get('data.videos')[backgroundId].full.fileIdentifier);
    this.set('backgroundVideoKeys', this.get('data.config.backgroundVideos'));
    this.showVideoSelect();
    this.set('selectionVideos', []);

    for (let vid in this.get('data.videos')) {
      this.get('selectionVideos').pushObject(this.get('data.videos')[vid]);
    }

    let afterVideoListData = [
    ];

    for (let key in this.get('data.attributes')){
      let videos = [];

      afterVideoListData.push(Ember.copy(this.get('data.attributes')[key]));

      for (let i = 0; i < afterVideoListData[afterVideoListData.length - 1].videos.length; i++){
        videos.push(this.get('data.videos')[afterVideoListData[afterVideoListData.length - 1].videos[i]]);
      }

      afterVideoListData[afterVideoListData.length - 1].videos = videos;
    }

    afterVideoListData.unshift(
      {
        prettyName: "History",
        description: "",
        x: 0,
        y: 0,
        videos: [
          {
            prettyName: "ioenasihoetna",
            description: "oansionasnt",
            attributes: [ ],
            relations: [
              {
                relatedId: "",
                difficulty: 1,
                attributeId: ""
              }
            ],
            full: {
              fileIdentifier: "kenny_band_1.mp4",
              isUrl: false,
              attribution: ""
            },
            teaser: {
              fileIdentifier: "kenny_band_1.mp4",
              isUrl: false,
              attribution: ""
            }
          }
        ]
      }
    );
    
    this.set('afterVideoListData', afterVideoListData);
  },
  
  click() {
    this.set('focus', false);
    this.showVideoSelect();
  },
  actions: {
    videoSelected(sender, videoData) {
      if (videoData) {
        var url = videoData.full.fileIdentifier;
        //strips off media fragments fix by sending vid object data from model
        this.set('video', this.get('data.config.modelIdentifier') + '/' + url);
        this.set('displayVideo', true);
        this.set('videoPlaying', true);
        this.hideVideoSelect();
        this.set('focus', true);
      }
      else {
        this.pauseVideo();
      }
    },
    videoEnded() {
      this.set('focus', false);
      this.showVideoSelect();
      this.set('displayVideo', false);
    },
    cycleBackground() {
      let backArrayLength = this.get('backgroundVideoKeys').length;
      let curVidPos = this.get('backgroundVideoPos');

      this.set('backgroundVideoPos', (curVidPos + 1) % backArrayLength);

      let backgroundId = this.get('data.config.backgroundVideos')[this.get('backgroundVideoPos')];
      this.set('backgroundVideoUrl', this.get('data.videos')[backgroundId].full.fileIdentifier);
    },
    doNothing(sender, selected) {
      console.log(selected);
    },

    cancelPressed() {
      this.cancel();
    },
    resetTimeout() {
      let component = this;

      clearTimeout(this.get('displayVideoSelectTimeout'));

      let timeout = setTimeout(() => {
                      component.hideVideoSelect();
                      component.set('focus', true);
                    }, this.get('data.config.ui.idle') * 1000);

      this.set('displayVideoSelectTimeout', timeout);
    }
  }
});
