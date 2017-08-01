import Ember from 'ember';
import KeyboardControls from '../mixins/keyboard-controls';

const { inject: { service } } = Ember;

export default Ember.Component.extend(KeyboardControls, {
  metadata: service(),
  modelData: service(),
  
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

  _hideOverlays: function() {
    this.setProperties({
      displayVideoSelect: false,
      displayVideo: false,
      displayAfterVideoList: false,
      displayMapView: false
    });
  },
  _appendVideoHistory: function() {
    let playingVidId = this.get('playingVidId');
    let history = this.get('videoHistory');
    
    if (history.videos[0] !== playingVidId) {
      history.videos.unshift(playingVidId);
    }
  },
  _resetVideoHistory: function() {
    this.set('videoHistory', {
      prettyName: "History",
      description: "",
      x: 0,
      y: 0,
      videos: [ ]
    });
  },
  _keyboardInput: function() {
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
    this._keyboardInput();
  },
  cancel: function() {
    this.set('displayVideoSelect', false);
      
    this._keyboardInput();
  },
  goNext: function() {
    this._keyboardInput();
  },
  goPrevious: function() {
    this._keyboardInput();
  },
  getRelatedVids: function(currentVid, attributeId, difficulty, recursiveDepth) {
    let relatedVids = [];

    for (let relation = 0; relation < currentVid.relations.length; relation++) {
      let vidRelation = currentVid.relations[relation];
      
      if (vidRelation.attributeId === attributeId) {
        let relatedId = vidRelation.relatedId;
        
        if (relatedVids.indexOf(relatedId) === -1) {
          let vid = Ember.copy(this.get(`modelData.videos.${relatedId}`), true);
          
          vid.difficulty = difficulty + vidRelation.difficulty;
          vid.vidId = relatedId;
          
          relatedVids.push(vid);
        }//if
      }//if
    }//for

    if (recursiveDepth > 0) {
      for (let vidNdx = 0; vidNdx < relatedVids.length; vidNdx++) {
        let diff = difficulty + relatedVids[relatedVids.length - 1].difficulty;
        
        relatedVids.concat(this.getRelatedVids(relatedVids[vidNdx],
                                               attributeId,
                                               diff,
                                               recursiveDepth - 1));
      }//for
    }//if

    return relatedVids.sort(function(a, b) {
      return a.difficulty > b.difficulty;
    });
  },
  _makeAfterVideoList: function() {
    let modelData = this.get('modelData');
    let localAfterVidData = [ ];
    let playingVidData = Ember.copy(modelData.get(`videos.${this.get('playingVidId')}`), true);
    let vidAttributes = playingVidData.attributes;

    for (let attributeIndex = 0; attributeIndex < vidAttributes.length; attributeIndex++) {
      let attributeId = vidAttributes[attributeIndex];
      let attributeObj = Ember.copy(modelData.get(`attributes.${attributeId}`), true);
      
      attributeObj.videos = this.getRelatedVids(playingVidData, attributeId, 0, 1);
      
      if (attributeObj.videos.length !== 0) {
        attributeObj.videos.forEach(function(video, index) { // jshint ignore:line
          attributeObj.videos[index] = { id: video.vidId, diff: video.difficulty };
        });
        
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

    this._resetVideoHistory();
    
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
    videoSelected(vidId, attributeId, diff) {
      if (vidId) {
        let playingVidId = this.get('playingVidId');
        
        clearTimeout(this.get('idleTimeout'));
        
        this.setProperties({
          displayVideo: true,
          videoPlaying: true,
          focus: true,
          displayMapView: false,
          displayVideoSelect: false,
          displayAfterVideoList: false
        });
        
        if (vidId !== playingVidId) {
          let metadata = this.get('metadata');
          let modelData = this.get('modelData');
          let vid = modelData.get(`videos.${vidId}`);
          
          metadata.addNode({
            id: vidId,
            prettyName: vid.prettyName,
            attributes: vid.attributes
          });
          
          if (playingVidId !== null) {
            metadata.addEdge({
              fromVideo: playingVidId,
              toVideo: vidId,
              attribute: attributeId,
              difficulty: diff
            });
          }
          
          this.set('playingVidId', vidId);
        }
        
        this.set('displayAfterVideoList', false);

        this._appendVideoHistory();
        this._makeAfterVideoList();
      }
      else {
        this.send('resetTimeout');
      }
    },
    videoEnded(vidId, duration ) {
      let metadata = this.get('metadata');
      
      this.setProperties({
        displayAfterVideoList: true,
        focus: false,
        displayVideo: false,
        playingVidId: null,
        playingVidStartTime: 0
      });
      
      metadata.editNode(vidId, {
        length: duration,
        timeWatched: duration
      });
      
      this.send('resetTimeout');
    },
    pauseVideo(vidId, currentTime, duration) {
      let metadata = this.get('metadata');
      
      this.set('playingVidStartTime', currentTime);

      this.setProperties({
        displayAfterVideoList: true,
        focus: false,
        videoPlaying: false
      });
      
      metadata.editNode(vidId, {
        length: duration,
        timeWatched: currentTime
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
          component._hideOverlays();
          component._resetVideoHistory();
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
