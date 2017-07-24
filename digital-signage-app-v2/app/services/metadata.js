import Ember from 'ember';

export default Ember.Service.extend({
  nodes: null,
  edges: null,
  
  init() {
    this._super(...arguments);
    
    this.clearData();
  },
  addNode(node = { }) {
    this.get('nodes').pushObject({
      id: node.id ? node.id : null,
      prettyName: node.prettyName ? node.prettyName : null,
      length: node.length ? node.length : null,
      timeWatched: node.timeWatched ? node.timeWatched : null,
      attributes: Ember.isArray(node.attributes) ? node.attributes : [ ]
    });
  },
  editNode(id, newData = { }) {
    this.get('nodes').forEach((node, index) => {
      if (node.id === id) {
        let newDataKeys = Object.keys(newData);
        
        for (let i = 0; i < newDataKeys.length; i++) {
          if (newDataKeys[i] in this.get(`nodes.${index}`)) {
            this.set(`nodes.${index}.${newDataKeys[i]}`, newData[newDataKeys[i]]);
          }
        }
      }
    }, this);
  },
  addEdge(edge = { }) {
    this.get('edge').pushObject({
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
    console.log({
      nodes: this.get('nodes'),
      edges: this.get('edges')
    });
    
    this.clearData();
  },
  clearData() {
    this.setProperties({
      nodes: [ ],
      edges: [ ]
    });
  }
});
