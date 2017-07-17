import Ember from 'ember';
import vis from 'npm:vis';

export default Ember.Service.extend({
  edges: null,
  nodes: null,
  options: null,
  
  init() {
    this._super(...arguments);
    
    let options = {
      manipulation: { },
      interaction: {
        hover: true
      },
      nodes: {
        size: 15,
        borderWidth: 2,
        shadow: true,
        shape: "circle"
      },
      edges: {
        shadow: true,
        arrows: 'to',
        length: 400,
        scaling: {
          min: 1,
          max: 12.5,
          label: {
            enabled: false,
          }
        },
        font: {
          align: 'bottom',
          size: 15
        }
      }
    };
    
    this.setProperties({
      edges: new vis.DataSet([ ]),
      nodes: new vis.DataSet([ ]),
      options: options
    });
  },
  clearNodes() {
    return this.get('nodes').clear();
  },
  clearEdges() {
    return this.get('edges').clear();
  },
  clear() {
    return { nodes: this.clearNodes(), edges: this.clearEdges() };
  },
  loadNodes(nodes) {
    return this.get('nodes').add(nodes);
  },
  loadEdges(edges) {
    return this.get('edges').add(edges);
  },
  updateNode(node) {
    return this.get('nodes').update(node);
  },
  updateEdge(edge) {
    return this.get('edges').update(edge);
  },
  removeNode(param) {
    return this.get('nodes').remove(param);
  },
  removeEdge(param) {
    return this.get('edges').remove(param);
  }
});
