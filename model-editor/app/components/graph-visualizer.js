import Ember from 'ember';
import vis from 'npm:vis';

export default Ember.Component.extend({
  classNames: ['graph-area'],
  classNameBindings: ['attributesExpanded:attributes-offset:flush-left', 'propertiesExpanded:properties-offset:flush-right', 'configurationExpanded:graph-area--with-config:flush-bottom'],

  network: null,
  graphOptions: {
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
  },
  graphData: {
    nodes: null,
    edges: null
  },

  /* for adding edges */
  fromVid: null,
  toVid: null,
  relationsLength: null,

  popoverTitle: null,
  popoverContent: null,
  
  /* graph updata data */
  addAttributeData: null,
  editAttributeData: null,
  addVideoData: null,
  editVideoData: null,
  
  /* editor states */
  removeEdgeMode: false,
  
  init() {
    this._super(...arguments);
    
    let nodes = new vis.DataSet([]);

    let edges = new vis.DataSet([]);

    /* Creates the initial graph */
    for (let video in this.get('data.videos')) {
      let vid = this.get('data.videos')[video];
      let nodeObj = { };

      nodeObj.id = video;
      nodeObj.label = vid.prettyName.length > 10 ? vid.prettyName.substr(0, 6) + " ..." : vid.prettyName;

        for (let i = 0; i < vid.relations.length; i++) {
          let attr = this.get('data.attributes')[vid.relations[i].attributeId];
          let diff = vid.relations[i].difficulty;
          let edgeObj = { };

          /* controls colors of the edges */
          let red = diff > 0 ? 10 * diff : 0;
          let green = diff < 0 ? -10 * diff : 0;
          let blue = 127 - (red + green) / 2;
          let color = "rgb(" + red + "," + green + "," + blue + ")";

          edgeObj.from = video;
          edgeObj.to = vid.relations[i].relatedId;
          edgeObj.value = Math.abs(diff);
          edgeObj.pos = i;
          edgeObj.label = attr.prettyName.length > 10 ? attr.prettyName.substr(0, 6) + " ..." : attr.prettyName;
          edgeObj.color = color;
          edgeObj.id = video + "_" + i + "_" + vid.relations[i].attributeId;
          edgeObj.attr = vid.relations[i].attributeId;

          edges.add(edgeObj);
        }//for

      nodes.add(nodeObj);
    }//for

    this.set('graphData.nodes', nodes);
    this.set('graphData.edges', edges);
  },
  
  didRender() {
    if (this.get('network') === null) {
      this.send('drawGraph');
    }//if
  },
  addAttributeObserver: Ember.observer('addAttributeData', function() {
    if (this.get('addAttributeData')) {
      let network = this.get('network');
      let domPos = Ember.copy(this.get('addAttributeData.location'));
      
      this.get('getVideoCallback') (network.getNodeAt(domPos));
    }//if
  }),
  editAttributeObserver: Ember.observer('editAttributeData', function() {
    if (this.get('editAttributeData')) {
      let attr = this.get('editAttributeData');
      let newLabel = attr.data.prettyName.length > 10 ? attr.data.prettyName.substr(0, 6) + " ..." : attr.data.prettyName;
      let edges = this.get('graphData.edges');
      
      edges.forEach(function (edge) {
        if (edge.id.substr(edge.id.lastIndexOf('_') + 1) === attr.attributeId) {
          let newAttr = edge;
          
          newAttr.label = newLabel;
          
          edges.update(newAttr);
        }//if
      });
    }//if
  }),
  addVideoObserver: Ember.observer('addVideoData', function() {
    if (this.get('addVideoData')) {
      let vidId = Ember.copy(this.get('addVideoData.videoId'));
      let vid = Ember.copy(this.get('addVideoData.data'));
      let nodeObj = { };

      nodeObj.id = vidId;
      nodeObj.label = vid.prettyName.length > 10 ? vid.prettyName.substr(0, 6) + " ..." : vid.prettyName;
      
      this.get('graphData.nodes').add(nodeObj);
    }//if
  }),
  editVideoObserver: Ember.observer('editVideoData', function() {
    if (this.get('editVideoData')) {
      let vidId = Ember.copy(this.get('editVideoData.videoId'));
      let vid = Ember.copy(this.get('editVideoData.data'));
      let nodeObj = { };

      nodeObj.id = vidId;
      nodeObj.label = vid.prettyName.length > 10 ? vid.prettyName.substr(0, 6) + " ..." : vid.prettyName;
      
      this.get('graphData.nodes').update(nodeObj);
    }
  }),
  actions: {
    addEdgeMode() {
      this.get('network').addEdgeMode();
    },
    deleteEdgeMode() {
      this.set('removeEdgeMode', !this.get('removeEdgeMode'));
    },
    drawGraph() {
      let container = this.$('.graph-container')[0];
      let component = this;

      this.set('graphOptions.manipulation.addEdge', function (data, callback) {
        let fromVid = component.get('data.videos')[data.from];
        let toVid = component.get('data.videos')[data.to];
        let attributes = [ ];

        component.set('fromVid', data.from);
        component.set('toVid', data.to);
        component.set('relationsLength', fromVid.relations.length);

        for (let fromAttr = 0; fromAttr < fromVid.attributes.length; fromAttr++) {
          let attr = fromVid.attributes[fromAttr];

          if (toVid.attributes.includes(attr)) {
            attr = Ember.copy(component.get('data.attributes')[attr]);
            attr.data = attr.prettyName;
            attr.id = fromVid.attributes[fromAttr];

            attributes.push(attr);
          }//if
        }//for
        
        if (attributes.length === 0) {
          alert("Warning! Trying to make a relation between two videos with no shared attributes.");
          return;
        }//if

        component.set('relationsConfig.data.attributeId.data', attributes);

        component.$("#addRelationOverlay")
        .on('hide.bs.modal', function () {
          let el = Ember.$("#addRelationOverlay");

          component.set('relationsConfig.data.attributeId.data', [ ]);

          Ember.$("#addRelationOverlay").replaceWith("");
          component.$("#modal-container").append(el);

          component.set('fromVid', null);
          component.set('toVid', null);
          component.set('relationsLength', null);
        })
        .appendTo('body').modal('show');
      });

      let network = new vis.Network(container, this.get('graphData'), this.get('graphOptions'));

      network
      .on("selectNode", function (param) {
        component.get('videoSelectedCallback') (param.nodes[0]);
      })
      .on("deselectNode", function (param) {
        if (param.nodes.length === 0) {
          component.get('videoSelectedCallback') (null);
        }
      })
      .on("hoverNode", function (param) {
        //popover support stuff. built-in support not working. 
        let nodePos = this.canvasToDOM(this.getPositions([param.node])[param.node]);
        let el = component.$(".canvas-popover");

        component.set('popoverTitle', component.get('data.videos')[param.node].prettyName);
        component.set('popoverContent', component.get('data.videos')[param.node].description);
 
        el.css("left", nodePos.x).css("top", nodePos.y);
        el.removeClass("hidden");
      })
      .on("blurNode", function () {
        component.$(".canvas-popover").addClass("hidden");
      })
      .on("dragStart", function () {
        component.$(".canvas-popover").addClass("hidden");
      })
      .on("click", function (param) {
        component.$(".canvas-popover").addClass("hidden");
        
        if (param.nodes.length === 0) {
          this.disableEditMode();
        }//if

        if (param.edges.length === 1 && component.get('removeEdgeMode')) {
          let edges = component.get('graphData.edges');
          let edge = edges.get(param.edges[0]);
          
          edges.remove(edge);
          
          component.set('removeEdgeMode', false);
          component.get('removeEdgeCallback') (edge.from, edge.pos);
        }//if
      });

      this.set('network', network);
    },
    createEdge(data) {
      let attr = this.get('data.attributes')[data.attributeId];
      let diff = data.difficulty;
      let edgeObj = { };

      let red = diff > 0 ? 10 * diff : 0;
      let green = diff < 0 ? -10 * diff : 0;
      let blue = 127 - ((red + green) / 2);

      let color = "rgb(" + red + "," + green + "," + blue + ")";

      edgeObj.from = this.get('fromVid');
      edgeObj.to = this.get('toVid');
      edgeObj.value = Math.abs(diff);
      edgeObj.pos = this.get('relationsLength');
      edgeObj.label = attr.prettyName.length > 10 ? attr.prettyName.substr(0, 6) + " ..." : attr.prettyName;
      edgeObj.color = color;
      edgeObj.id = edgeObj.from + "_" + this.get('graphData.edges').length;
      edgeObj.title = attr.prettyName;
      edgeObj.attr = data.attributeId;

      this.get('graphData.edges').add(edgeObj);

      if (Ember.$('#addRelationOverlay')) {
        Ember.$('#addRelationOverlay').modal('hide');
      }
      
      this.get('addEdgeCallback') (edgeObj, data.attributeId);

      this.get('videoSelectedCallback', edgeObj.from);
      
      this.get('network').selectNodes([edgeObj.from]);
    },
    doNothing() {

    }
  }
});
