import Ember from 'ember';
import KeyboardControls from '../mixins/keyboard-controls';
import toposort from 'npm:toposort';

export default Ember.Component.extend(KeyboardControls, {
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
  toggleVidPlayback: function() {
    this.toggleProperty('videoPlaying');
    
    this.set('focus', this.get('videoPlaying'));
  },
  select: function() {
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
  cancel: function() {
    this.toggleVidPlayback();

    this.send('resetTimeout');
  },
  goNext: function() {
    this.toggleVidPlayback();
    
    this.send('resetTimeout');
  },
  goPrevious: function() {
    this.toggleVidPlayback();

    this.send('resetTimeout');
  },
  getRelatedVids: function(currentVid, attributeId, difficulty, recursiveDepth) {
    let relatedVids = [];

    for (let relation = 0; relation < currentVid.relations.length; relation++) {
      let vidRelation = currentVid.relations[relation];
      
      if (vidRelation.attributeId === attributeId) {
        if (relatedVids.find(function(video) {
            return video.vidId !== this;
          }, vidRelation.relatedId) === undefined) {
          relatedVids.push(Ember.copy(this.get('data.videos')[vidRelation.relatedId], true));
          
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
      let attributeObj = Ember.copy(this.get('data.attributes')[attributeId], true);
      
      attributeObj.videos = this.getRelatedVids(playingVidData, attributeId, 0, 1);
      
      if (attributeObj.videos.length !== 0) {
        localAfterVidData.push(attributeObj);
      }//if
    }//for
    
    localAfterVidData.unshift(this.get('videoHistory'));
        
    this.set('afterVideoListData', localAfterVidData);
  },
  makeMapData: function() {
    let mapData = [ ];
    let attributes = Ember.copy(this.get('data.attributes'), true);
    
    for (let key in attributes) {
      
      mapData.push(attributes[key]);
      mapData[mapData.length - 1].id = key;
      
      for (let i = 0; i < mapData[mapData.length - 1].videos.length; i++) {
        let vidId = mapData[mapData.length - 1].videos[i];
        let video =  this.get('data.videos')[vidId];
        
        video.id = vidId;
        
        mapData[mapData.length - 1].videos[i] = video;
      }//for
    }//for
    
    mapData.sort(function(a, b) {
      return (a.y - b.y) || (a.x - b.x);
    });
    
    mapData.forEach(function(attribute) {
      let nodes = [ ];
      let edges = [ ];
      
      nodes = attribute.videos;
      
      nodes.forEach(function(node, index) {
      nodes[index] = [ node ];
        
        node.relations.forEach(function(edgeData) {
          let edgeObj = { };
          
          if (edgeData.difficulty >= 0 && edgeData.attributeId === attribute.id) {
            edgeObj.to = edgeData.relatedId;
            edgeObj.from = node.id;
            edgeObj.diff = edgeData.difficulty;
            
            edges.push(edgeObj);
          }//if
        });
      });
      
      edges.sort(function(a, b) {
        return a.diff - b.diff;
      });
      
      if (edges.length) {
        let topoEdges = [ ];

        this.kruskals(nodes, edges).forEach(function(edge) {
          let arr = [ ];
          
          arr[0] = edge.from;
          arr[1] = edge.to;
          
          topoEdges.push(arr);
        });
        
        topoEdges = toposort(topoEdges);
        
        for (let videoIndex = 0; videoIndex < topoEdges.length; videoIndex++) {
          let videoId;
          
          if (videoIndex > 4) {
            break;
          }//if
          
          videoId = topoEdges[videoIndex];
          
          topoEdges[videoIndex] = this.get('data.videos')[videoId];
        }//for
        
        attribute.videos = topoEdges;
      }//if
      else {
        attribute.videos = nodes[0];
      }//else
      
      if (!attribute.videos) {
        mapData.splice(mapData.indexOf(attribute), 1);
      }
    }, this);

    this.set('mapData', mapData);
  },
  //move to service
  kruskals: function(nodes, edges) {
    let numTrees = 0;
    let kst = [ ];
    let numNodes = nodes.length;

    do {
      let rel = edges.shift();
      let fromTreeIndex;
      let toTreeIndex;

      if (!rel) {
        break;
      }//if
      
      for (let treeIndex = 0; treeIndex < nodes.length; treeIndex++) {
        let tree = nodes[treeIndex];
        
        for (let nodeIndex = 0; nodeIndex < tree.length; nodeIndex++) {
          let node = tree[nodeIndex];
          
          if (node.id.toString() === rel.from) {
            fromTreeIndex = treeIndex;
          }//if
          else if (node.id.toString() === rel.to) {
            toTreeIndex = treeIndex;
          }//else if
        }//for
        
        if (fromTreeIndex === undefined || toTreeIndex === undefined) {
          continue;
        }//if
        
        if (fromTreeIndex !== toTreeIndex) {
          let newTree = nodes[fromTreeIndex].concat(nodes[toTreeIndex]);
          nodes.push(newTree);
          
          nodes.splice(fromTreeIndex, 1);
          nodes.splice(toTreeIndex, 1);

          kst.push(rel);
          
          numTrees = numTrees + 1;
          
          rel = null;
          
          break;
        }//if
      }//for
      
    } while (numTrees < numNodes - 1);

    return kst;
  },
  bgVidData: Ember.computed('bgVidPos', function() {
      let backgroundId = this.get('data.config.backgroundVideos')[this.get('bgVidPos')];
      
      return this.get('data.videos')[backgroundId];
  }),
  init() {
    this._super(...arguments);
    this.set('keyboard', this.get('data.config.keyboard'));

    this.makeMapData();
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
    pauseVideo(sender, currentTime){
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
      let bgVidKeys = this.get('data.config.backgroundVideos');
      
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

      let timeout = (function(component){
        return setTimeout(function() {
          component.hideOverlays();
          
          component.resetVideoHistory();
          
          component.set('focus', true);
        }, component.get('data.config.ui.idle') * 1000);
      }) (this);

      this.set('idleTimeout', timeout);
    }
  }
});
