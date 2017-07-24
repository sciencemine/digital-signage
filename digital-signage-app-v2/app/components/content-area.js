import Ember from 'ember';
import KeyboardControls from '../mixins/keyboard-controls';

export default Ember.Component.extend(KeyboardControls, {
  modelData: Ember.inject.service(),
  
  keyboard: null,
  
  idleTimeout: null,
  
  displayVideoSelect: false,
  displayVideo: false,
  displayAfterVideoList: false,
  displayMapView: true,
  
  videoPlaying: false,
  
  bgVidPos: 0,
  vidSelectPos: 0,
  
  playingVidData: null,
  vidSelectData: [],
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
    this.get('videoHistory.videos').push(this.get('playingVidData'));
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
  keyboardInput: function() {
    if (this.get('videoPlaying')) {
      this.send('pauseVideo');
    }
    else {
      this.setProperties({
        displayMapView: true,
        focus: false
      });
    }

    this.send('resetTimeout');
  },
  select: function() {
    this.keyboardInput();
  },
  cancel: function() {
    this.keyboardInput();
  },
  goNext: function() {
    this.keyboardInput();
  },
  goPrevious: function() {
    this.keyboardInput();
  },
  getRelatedVids: function(currentVid, attributeId, difficulty, recursiveDepth) {
    let relatedVids = [];

    for (let relation = 0; relation < currentVid.relations.length; relation++) {
      let vidRelation = currentVid.relations[relation];
      
      if (vidRelation.attributeId === attributeId) {
        if (relatedVids.find(function(video) {
            return video.vidId !== this;
          }, vidRelation.relatedId) === undefined) {
          relatedVids.push(Ember.copy(this.get('modelData.videos')[vidRelation.relatedId], true));
          
          let vid = relatedVids[relatedVids.length - 1];
          
          vid.difficulty = difficulty + vidRelation.difficulty;
          vid.vidId = vidRelation.relatedId;
        }//if
      }//if
    }//for

    if (recursiveDepth > 0) {
      for (let vidNdx = 0; vidNdx < relatedVids.length; vidNdx++) {
        relatedVids.concat(this.getRelatedVids(relatedVids[vidNdx], attributeId,
          difficulty + relatedVids[relatedVids.length - 1].difficulty, recursiveDepth - 1));
      }//for
    }//if

    return relatedVids.sort(function(a, b) {
      return a.difficulty > b.difficulty;
    });
  },
  makeAfterVideoList: function() {
    let localAfterVidData = [ ];
    let playingVidData = Ember.copy(this.get('playingVidData'), true);
    let vidAttributes = playingVidData.attributes;

    for (let attributeIndex = 0; attributeIndex < vidAttributes.length; attributeIndex++) {
      let attributeId = vidAttributes[attributeIndex];
      let attributeObj = Ember.copy(this.get(`modelData.attributes.${attributeId}`), true);
      
      attributeObj.videos = this.getRelatedVids(playingVidData, attributeId, 0, 1);
      
      if (attributeObj.videos.length !== 0) {
        localAfterVidData.push(attributeObj);
      }//if
    }//for
    
    localAfterVidData.unshift(this.get('videoHistory'));
        
    this.set('afterVideoListData', localAfterVidData);
  },
  bgVidData: Ember.computed('bgVidPos', function() {
    let modelData = this.get('modelData');
    
    let backgroundId = modelData.get(`config.backgroundVideos.${this.get('bgVidPos')}`);
      
    return modelData.get(`videos.${backgroundId}`);
  }),
  init() {
    this._super(...arguments);
    
    this.set('keyboard', this.get('modelData.keyboard'));

    this.resetVideoHistory();
    
    this.send('resetTimeout');
  },
  didRender() {
    let focus = this.get('focus');
    
    if (this.$().is(':focus') !== focus) {
      this.updateFocus(focus);
    }
  },
  click() {
    if (!this.get('displayVideoSelect') &&
        !this.get('displayAfterVideoList') &&
        !this.get('displayMapView')) {
      this.setProperties({
        displayMapView: true,
        focus: false
      });
    }//if
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
        displayVideo: false
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
      let bgVidKeys = this.get('modelData.config.backgroundVideos');
      
      let bgArrayLength = bgVidKeys.length;
      let curBgVidPos = this.get('bgVidPos');

      this.set('bgVidPos', (curBgVidPos + 1) % bgArrayLength);
    },
    doNothing(/*sender, selected*/) {
      
    },
    cancelPressed() {
      this.cancel();
    },
    resetTimeout() {
      clearTimeout(this.get('idleTimeout'));

      let timeout = (function(component) {
        return setTimeout(function() {
          component.hideOverlays();
          
          component.resetVideoHistory();
          
          component.set('focus', true);
        }, component.get('modelData.ui.idle') * 1000);
      }) (this);

      this.set('idleTimeout', timeout);
    }
  }
});
