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

  showVideoSelect: function() {
    this.set('displayVideoSelect', true);

    this.send('resetTimeout');
  },
  hideVideoSelect: function() {
    this.set('displayVideoSelect', false);

    clearTimeout(this.get('idleTimeout'));
  },
  showMapView: function() {
    this.set('displayMapView', true);

    this.send('resetTimeout');
  },
  hideMapView: function() {
    this.set('displayMapView', false);

    clearTimeout(this.get('idleTimeout'));
  },
  showDisplayVideo: function() {
    this.set('displayVideo', true);

    this.send('resetTimeout');
  },
  hideDisplayVideo: function() {
    this.set('displayVideo', false);

    clearTimeout(this.get('idleTimeout'));
  },
  showAfterVideoList: function() {
    this.set('displayAfterVideoList', true);

    this.send('resetTimeout');
  },
  hideAfterVideoList: function() {
    this.set('displayAfterVideoList', false);

    clearTimeout(this.get('idleTimeout'));
  },
  appendVideoHistory: function() {
    this.get('videoHistory.videos').push(this.get('playingVidData'));
  },
  clearVideoHistory: function() {
    this.set('videoHistory', {
      prettyName: "History",
      description: "",
      x: 0,
      y: 0,
      videos: [ ]
    });
  },
  pauseVideo: function() {
    this.set('videoPlaying', !this.get('videoPlaying'));
    this.set('displayVideoSelect', !this.get('videoPlaying'));
    this.set('focus', this.get('videoPlaying'));
  },
  select: function() {
    this.set('videoPlaying', false);
    this.set('focus', false);

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
  getRelatedVids: function(currentVid, attributeId, difficulty, recursiveDepth) {
    let relatedVids = [];

    for (let relation = 0; relation < currentVid.relations.length; relation++) {
      if (currentVid.relations[relation].attributeId === attributeId) {
        if(relatedVids.find(function(video) {
            return video.vidId !== this;
          }, currentVid.relations[relation].relatedId) === undefined) {
          relatedVids.push(this.get('data.videos')[currentVid.relations[relation].relatedId]);
          
          relatedVids[relatedVids.length - 1].difficulty = difficulty + currentVid.relations[relation].difficulty;
          relatedVids[relatedVids.length - 1].vidId = currentVid.relations[relation].relatedId;
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
    let vidAttributes = this.get('playingVidData.attributes');

    for (let attributeIndex = 0; attributeIndex < vidAttributes.length; attributeIndex++) {
      let attributeId = vidAttributes[attributeIndex];
      
      localAfterVidData.push(this.get('data.attributes')[attributeId]);

      localAfterVidData[localAfterVidData.length - 1].videos = this.getRelatedVids(this.get('playingVidData'), attributeId, 0, 2);
      
      if (localAfterVidData[localAfterVidData.length - 1].videos.length === 0) {
        localAfterVidData.pop();
      }//if
    }//for
    
    localAfterVidData.unshift(this.get('videoHistory'));
        
    this.set('afterVideoListData', localAfterVidData);
  },
  makeMapData: function() {
    let mapData = [ ];
    
    for (let key in this.get('data.attributes')) {
      
      mapData.push(Ember.copy(this.get('data.attributes')[key]));
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
    }, this);

    this.set('mapData', mapData);
  },
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
    this.clearVideoHistory();
    
    this.send('resetTimeout');
  },
  didRender() {
    if (this.$().is(':focus') !== this.get('focus')) {
      this.updateFocus(this.get('focus'));
    }
  },
  click() {
    if (!this.get('displayVideoSelect') &&
        !this.get('displayAfterVideoList') &&
        !this.get('displayMapView')) {
      this.set('focus', false);
      
      this.showMapView();
    }//if
  },
  actions: {
    videoSelected(sender, videoData) {
      if (videoData) {
        this.set('playingVidData', videoData);
        
        this.set('displayVideo', true);
        this.set('videoPlaying', true);
        this.set('focus', true);
        
        this.hideVideoSelect();
      }
      else {
        this.pauseVideo();
        
        this.send('resetTimeout');
      }
    },
    stackSelected(sender, vidArr) {
      this.set('vidSelectData', vidArr);
      
      this.showVideoSelect();
      this.hideMapView();
    },
    videoEnded() {
      this.set('focus', false);
      this.set('displayVideo', false);
      
      this.appendVideoHistory();
      
      this.makeAfterVideoList();
      
      this.showAfterVideoList();
    },
    cycleBackground() {
      let bgVidKeys = this.get('data.config.backgroundVideos');
      
      let bgArrayLength = bgVidKeys.length;
      let curBgVidPos = this.get('bgVidPos');

      this.set('bgVidPos', (curBgVidPos + 1) % bgArrayLength);
    },
    doNothing(/*sender, selected*/) {
      //console.log(selected);
    },
    cancelPressed() {
      this.cancel();
    },
    resetTimeout() {
      clearTimeout(this.get('idleTimeout'));

      let timeout = (function(component){
                      return setTimeout(function() {
                        component.hideVideoSelect();
                        component.hideMapView();
                        component.hideDisplayVideo();
                        component.hideAfterVideoList();
                        
                        component.clearVideoHistory();
                        
                        component.set('focus', true);
                      }, component.get('data.config.ui.idle') * 1000);
                    }) (this);

      this.set('idleTimeout', timeout);
    }
  }
});
