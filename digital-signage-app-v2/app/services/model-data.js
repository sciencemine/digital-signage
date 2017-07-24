import Ember from 'ember';
import toposort from 'npm:toposort';

export default Ember.Service.extend({
  data: null,
  mapData: null,
  backgroundVideos: null,
  
  init() {
    this._super(...arguments);
    
    this.setProperties({
      data: null,
      mapData: null,
      backgroundVideos: null
    });
  },
  _makeMapData() {
    if (!this.get('data')) {
      return;
    }
    
    let mapData = [ ];
    let attributes = Ember.copy(this.get('attributes'), true);
    let videos = Ember.copy(this.get('videos'), true);
    
    for (let key in attributes) {
      
      mapData.push(attributes[key]);
      mapData[mapData.length - 1].id = key;
      
      for (let i = 0; i < mapData[mapData.length - 1].videos.length; i++) {
        let vidId = mapData[mapData.length - 1].videos[i];
        let video =  videos[vidId];
        
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

        this._kruskals(nodes, edges).forEach(function(edge) {
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
          
          topoEdges[videoIndex] = videos[videoId];
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
  _kruskals(nodes, edges) {
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
  load(data) {
    this.set('data', data);
    
    this._makeMapData();
  },
  config: Ember.computed('data', function() {
    let data = this.get('data');
    
    return data ? data.config : null;
  }),
  modelIdentifier: Ember.computed('data', function() {
    let data = this.get('data');
    
    return data ? data.config.modelIdentifier : null;
  }),
  ui: Ember.computed('data', function() {
    let data = this.get('data');
    
    return data ? data.config.ui : null;
  }),
  keyboard: Ember.computed('data', function() {
    let data = this.get('data');
    
    return data ? data.config.keyboard : null;
  }),
  videos: Ember.computed('data', function() {
    let data = this.get('data');
    
    return data ? data.videos : null;
  }),
  attributes: Ember.computed('data', function() {
    let data = this.get('data');
    
    return data ? data.attributes : null;
  })
});
