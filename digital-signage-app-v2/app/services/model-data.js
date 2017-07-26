import Ember from 'ember';
import toposort from 'npm:toposort';

export default Ember.Service.extend({
  _data: null,
  _mapData: null,
  
  init() {
    this._super(...arguments);
    
    this.setProperties({
      _data: null,
      _mapData: null
    });
  },
  _makeMapData() {
    if (Ember.isNone(this.get('_data'))) {
      return;
    }
    
    let mapData = [ ];
    let attributes = Ember.copy(this.get('attributes'), true);
    
    for (let key in attributes) {
      let attrObj = attributes[key];
      attrObj.id = key;
      
      mapData.push(attrObj);
    }//for
    
    
    mapData.sort(function(a, b) {
      return (a.y - b.y) || (a.x - b.x);
    });
    
    mapData.forEach(function(attribute) {
      let videos = Ember.copy(attribute.videos, true);
      let nodes = [ ];
      let edges = [ ];
      
      nodes = attribute.videos;
      
      nodes.forEach(function(node, index) {
        nodes[index] = [ node ];
        
        this.get(`videos.${node}.relations`).forEach(function(edgeData) {
          let edgeObj = { };
          
          if (edgeData.difficulty >= 0 && edgeData.attributeId === attribute.id) {
            edgeObj.to = edgeData.relatedId;
            edgeObj.from = node;
            edgeObj.diff = edgeData.difficulty;
            
            edges.push(edgeObj);
          }//if
        }, this);
      }, this);
      
      edges.sort(function(a, b) {
        return a.diff - b.diff;
      });
      
      if (Ember.isPresent(edges)) {
        let topoEdges = [ ];

        this._kruskals(nodes, edges).forEach(function(edge) {
          let arr = [ ];
          
          arr[0] = edge.from;
          arr[1] = edge.to;
          
          topoEdges.push(arr);
        });
        
        topoEdges = toposort(topoEdges);
        
        attribute.videos = topoEdges;
      }
      else {
        attribute.videos = videos;
      }
      
      if (Ember.isBlank(attribute.videos)) {
        mapData.splice(mapData.indexOf(attribute), 1);
      }
    }, this);

    this.set('_mapData', mapData);
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
          
          if (node === rel.from) {
            fromTreeIndex = treeIndex;
          }//if
          else if (node === rel.to) {
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
    this.set('_data', data);
    
    this._makeMapData();
  },
  mapData: Ember.computed('_mapData', function() {
    return this.get('_mapData');
  }),
  config: Ember.computed('_data', function() {
    let data = this.get('_data');
    
    return data ? Ember.copy(data.config, true) : null;
  }),
  modelIdentifier: Ember.computed('_data', function() {
    let data = this.get('_data');
    
    return data ? Ember.copy(data.config.modelIdentifier, true) : null;
  }),
  ui: Ember.computed('_data', function() {
    let data = this.get('_data');
    
    return data ? Ember.copy(data.config.ui, true) : null;
  }),
  keyboard: Ember.computed('_data', function() {
    let data = this.get('_data');
    
    return data ? Ember.copy(data.config.keyboard, true) : null;
  }),
  videos: Ember.computed('_data', function() {
    let data = this.get('_data');
    
    return data ? Ember.copy(data.videos, true) : null;
  }),
  attributes: Ember.computed('_data', function() {
    let data = this.get('_data');
    
    return data ? Ember.copy(data.attributes, true) : null;
  })
});
