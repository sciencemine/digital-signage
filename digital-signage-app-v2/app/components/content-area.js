import Ember from 'ember';
import KeyboardControls from '../mixins/keyboard-controls';

const { inject: { service } } = Ember;

export default Ember.Component.extend(KeyboardControls, {
  metadata: service(),
  modelData: service(),
  
  keyboard: null,
  
  idleTimeout: null,
  
  displayVideoSelect: false,
  displayVideo: false,
  displayAfterVideoList: false,
  displayMapView: true,
  
  videoPlaying: false,
  
  bgVidPos: 0,
  vidSelectPos: 0,
  
  playingVidId: null,
  playingVidStartTime: 0,
  
  vidSelectData: [ ],
  afterVideoListData: null,
  
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
    let playingVidId = this.get('playingVidId');
    let history = this.get('videoHistory');
    
    if (history.videos[0] !== playingVidId) {
      history.videos.unshift(playingVidId);
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
    this.set('displayVideoSelect', false);
      
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
    let modelData = this.get('modelData');
    let localAfterVidData = [ ];
    let playingVidData = Ember.copy(modelData.get(`videos.${this.get('playingVidId')}`), true);
    let vidAttributes = playingVidData.attributes;

    for (let attributeIndex = 0; attributeIndex < vidAttributes.length; attributeIndex++) {
      let attributeId = vidAttributes[attributeIndex];
      let attributeObj = Ember.copy(modelData.get(`attributes.${attributeId}`), true);

      attributeObj.id = attributeId;
      attributeObj.videos = this.getRelatedVids(playingVidData, attributeId, 0, 1);
      
      if (attributeObj.videos.length !== 0) {
        localAfterVidData.push(attributeObj);
      }//if
    }//for
    
    localAfterVidData.unshift(this.get('videoHistory'));

    this.set('afterVideoListData', localAfterVidData);
  },
  bgVidId: Ember.computed('bgVidPos', function() {
    return this.get(`modelData.backgroundVideos.${this.get('bgVidPos')}`);
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
    videoSelected(vidId) {
      if (vidId) {
        clearTimeout(this.get('idleTimeout'));
        
        this.setProperties({
          displayVideo: true,
          videoPlaying: true,
          focus: true,
          displayMapView: false,
          displayVideoSelect: false,
          displayAfterVideoList: false
        });
        
        if (vidId !== this.get('playingVidId')) {
          this.set('playingVidId', vidId);
          
          this.set('displayAfterVideoList', false);
        }
        else {
          this.set('displayAfterVideoList', false);
        }

        this.appendVideoHistory();
        this.makeAfterVideoList();
        
        let nodeMetadata = {
          id: videoData.id,
          prettyName: videoData.prettyName,
          attributes: [ ]
        };
        
        videoData.attributes.forEach((attributeKey) => {
          nodeMetadata.attributes.push({
            id: attributeKey,
            prettyName: this.get(`data.attributes.${attributeKey}.prettyName`)
          });
        }, this);
        
        let metadata = this.get('metadata');
        
        metadata.addNode(nodeMetadata);
        
        if (attributeId) {
          metadata.addEdge({
            fromVideo: playingVidData.id,
            toVideo: videoData.id,
            attribute: attributeId,
            difficulty: videoData.difficulty
          });
        }
      }
      else {
        this.send('resetTimeout');
      }
    },
    videoEnded(videoPos, length) { // jshint ignore:line
      this.setProperties({
        displayAfterVideoList: true,
        focus: false,
        displayVideo: false,
        playingVidId: null,
        playingVidStartTime: 0
      });
      
      this.set('playingVidData.startingTime', 0);
      
      this.get('metadata').editNode(this.get('playingVidData.id'), {
        length: length ? length : null,
        timeWatched: length ? length : null
      });
      
      this.send('resetTimeout');
    },
    pauseVideo(sender, currentTime, length) {
      this.toggleProperty('videoPlaying');
      this.set('playingVidStartTime', currentTime);
      
      this.get('metadata').editNode(this.get('playingVidData.id'), {
        length: length ? length : null,
        timeWatched: currentTime ? currentTime : null 
      });

      this.setProperties({
        displayAfterVideoList: true,
        focus: false,
        videoPlaying: false
      });
      
      this.send('resetTimeout');
    },
    stackSelected(stackIndex) {
      let vidArr = this.get(`modelData.mapData.${stackIndex}.videos`);
      
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
          
          component.get('metadata').logData();
          
          component.setProperties({
            focus: true,
            playingVidId: null,
            playingVidStartTime: 0,
            videoPlaying: false
          });
        }, component.get('modelData.ui.idle') * 1000);
      }) (this);

      this.set('idleTimeout', timeout);
    }
  }
});
