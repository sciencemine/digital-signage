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
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based'
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
  createNode(id, label, options = { }) {
    let nodeObj = Ember.merge({ id: id, label: this.shortenName(label) }, options);
    
    this.loadNodes(nodeObj);
  },
  createEdge(from, to, value, pos, label, attr, options = { }) {
    let edgeObj = Ember.merge({
      from: from,
      to: to,
      value: value,
      pos: pos,
      label: label,
      attr: attr
    }, options);
    
    if (typeof(edgeObj.value) === "number") {
      edgeObj.color = this.createRGBColor(edgeObj.value);
      edgeObj.value = Math.abs(edgeObj.value);
    }
    if (typeof(edgeObj.label) === "string") {
      edgeObj.label = this.shortenName(edgeObj.label);
    }
    
    edgeObj.id = edgeObj.from + "_" + edgeObj.pos + "_" + edgeObj.attr;
    
    return this.loadEdges(edgeObj);
  },
  createRGBColor(diff) {
    let red = diff > 0 ? 10 * diff : 0;
    let green = diff < 0 ? -10 * diff : 0;
    let blue = 127 - ((red + green) / 2);

    return "rgb(" + red + "," + green + "," + blue + ")";
  },
  shortenName(name) {
    return name.length > 15 ? name.substr(0, 11) + " ..." : name;
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
