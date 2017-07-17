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
  mapData: [ ],
  
  videoHistory: [ ],

 
  hideOverlays: function() {
    this.setProperties({
      displayVideoSelect: false,
      displayVideo: false,
      displayAfterVideoList: false,
      displayMapView: false
    });
  },
  appendVideoHistory: function() {
    let videoHist = this.get('videoHistory.videos');
    let playingVid = this.get('playingVidData');

    if(videoHist.length === 0 || videoHist[videoHist.length - 1].id !== playingVid.id){
      videoHist.push(playingVid);
    }
  },

  resetVideoHistory: function() {
    this.set('videoHistory', {
      prettyName: "History",
      description: "",
      x: 0,
      y: 0,
      videos: [ ]
    });
  },
  select: function() {
    this.set('videoPlaying', false);
    this.set('focus', false);
    this.showVideoSelect();

    this.send('resetTimeout');
  },
  cancel: function() {
    this.setProperties({
      displayVideoSelect: false,
    });
    this.keyboardInput();
  },
  goNext: function() {
    this.pauseVideo();

    this.send('resetTimeout');
  },
  goPrevious: function() {
    this.pauseVideo();

    this.send('resetTimeout');
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
  didRender() {
    if (this.$().is(':focus') !== this.get('focus')) {
      this.updateFocus(this.get('focus'));
    }
  },
  
  click() {
    this.set('focus', false);
    this.showVideoSelect();
  },
  actions: {
    videoSelected(sender, videoData) {
      if (videoData) {
        let playingVidData = this.get('playingVidData');

        clearTimeout(this.get('idleTimeout'));
        
        this.hideOverlays();

        this.setProperties({
          displayVideo: true,
          videoPlaying: true,
          focus: true
        });
        
        if (!playingVidData || playingVidData.id !== videoData.id) {
          this.set('playingVidData', videoData);
        }
        else if (!playingVidData || playingVidData.id === videoData.id) {
          this.set('displayAfterVideoList', false);
        }

        this.appendVideoHistory();
        this.makeAfterVideoList();
        
      }
      else {
        this.toggleVidPlayback();
        this.send('resetTimeout');
      }
    },
    videoEnded() {
      this.setProperties({
        displayAfterVideoList: true,
        focus: false,
        displayVideo: false
      });
      

      this.set('playingVidData.startingTime', 0);

      this.send('resetTimeout');
    },
    pauseVideo(sender, currentTime) {
      this.toggleProperty('videoPlaying');
      this.set('playingVidData.startingTime', currentTime);

      this.setProperties({
        displayAfterVideoList: true,
        focus: false,
        displayVideo: true
      });
      
      this.send('resetTimeout');
    },
    stackSelected(sender, vidArr) {      
      this.setProperties({
        displayVideoSelect: true,
        vidSelectData: vidArr,
        displayMapView: false
      });
      
      this.send('resetTimeout');
    },
    cycleBackground() {
      let backArrayLength = this.get('backgroundVideoKeys').length;
      let curVidPos = this.get('backgroundVideoPos');

      this.set('backgroundVideoPos', (curVidPos + 1) % backArrayLength);

      let backgroundId = this.get('data.config.backgroundVideos')[this.get('backgroundVideoPos')];
      this.set('backgroundVideoUrl', this.get('data.videos')[backgroundId].full.fileIdentifier);
    },
    doNothing(/*sender, selected*/) {
      //console.log(selected);
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
