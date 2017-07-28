import Ember from 'ember';

export default Ember.Service.extend({
  _nodes: null,
  _edges: null,
  
  init() {
    this._super(...arguments);
    
    this.clearData();
  },
  addNode(node = { }) {
    this.get('_nodes').pushObject({
      id: node.id ? node.id : null,
      prettyName: node.prettyName ? node.prettyName : null,
      length: node.length ? node.length : null,
      timeWatched: node.timeWatched ? node.timeWatched : null,
      attributes: Ember.isArray(node.attributes) ? node.attributes : [ ]
    });
  },
  editNode(id, newData = { }) { // TODO Make not loop
    this.get('_nodes').forEach((node, index) => {
      if (node.id === id) {
        let newDataKeys = Object.keys(newData);
        
        newDataKeys.forEach(function(key) {
          if (key in this.get(`_nodes.${index}`)) {
            this.set(`_nodes.${index}.${key}`, newData[key]);
          }
        }, this);
      }
    }, this);
  },
  addEdge(edge = { }) {
    this.get('_edges').pushObject({
      fromVideo: edge.fromVideo ? edge.fromVideo : null,
      toVideo: edge.toVideo ? edge.toVideo : null,
      attribute: edge.attribute ? edge.attribute : null,
      difficulty: edge.difficulty ? edge.difficulty : null
    });
  },
  logData() {
    // TODO
    // Ajax call to server endpoint
    // dumps data as { nodes, edges }
    
    if (Ember.isPresent(this.get('_nodes')) || Ember.isPresent(this.get('_edges'))) {
      console.log({
        nodes: this.get('_nodes'),
        edges: this.get('_edges')
      });
    }
    
    this.clearData();
  },
  clearData() {
    this.setProperties({
      _nodes: [ ],
      _edges: [ ]
    });
  }
});
