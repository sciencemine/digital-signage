import Ember from 'ember';
import vis from 'npm:vis';

export default Ember.Component.extend({
  notify: Ember.inject.service(),
  
  classNames: ['graph-area'],
  classNameBindings: [],

  /* The actual graph */
  network: null,
  
  /* Options for the graph from vis api */
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
  
  /* Data object containing the nodes and edges in the graph */
  graphData: {
    nodes: null,
    edges: null
  },

  /* For adding edges */
  fromVid: null,
  toVid: null,
  relationsLength: null,

  /* Popover contents */
  popoverTitle: null,
  popoverNodeId: null,
  
  /* Graph update data */
  addAttrToVideoData: null,
  editAttributeData: null,
  addVideoData: null,
  editVideoData: null,
  
  /* Editor states */
  removeEdgeMode: false,
  removeVideoMode: false,

  shortenName: function(name) {
    return name.length > 15 ? name.substr(0, 11) + " ..." : name;
  },

  createRGBcolor: function(diff) {
    let red = diff > 0 ? 10 * diff : 0;
    let green = diff < 0 ? -10 * diff : 0;
    let blue = 127 - ((red + green) / 2);

    return "rgb(" + red + "," + green + "," + blue + ")";
  },
  
  hidePopover: function() {
    this.set('popoverNodeId', null);
    this.$(".canvas-popover").addClass("hidden");
  },
  
  setStyle: function() {
    let el = Ember.$("#" + this.elementId);
    let width = Ember.$(window).width();
    let titleBottom = Ember.$("#content-area--header").height() +
                 Ember.$("#content-area--header").offset().top +
                 parseInt(Ember.$("#content-area--header").css('paddingBottom'));
    
    el.css('top', titleBottom);
    el.css('right', (this.get('propertiesExpanded') ? width - Ember.$("#properties-panel").offset().left : 0));
    el.css('bottom', Ember.$("#configuration-panel").height());
    el.css('left', (this.get('attributesExpanded') ? Ember.$("#attribute-panel").width() : 0));
  },

  popoverContent: Ember.computed('popoverNodeId', function() {
    let data = {
      videoId: this.get('popoverNodeId'),
      attributes: [ ]
    };

    if (this.get('popoverNodeId')) {
      for (let i = 0; i < this.get('data.videos')[this.get('popoverNodeId')].attributes.length; i++) {
        let attributeId = this.get('data.videos')[this.get('popoverNodeId')].attributes[i];
        let attributeObj = this.get('data.attributes')[attributeId];
        let popoverData = { };

        popoverData.prettyName = attributeObj.prettyName;
        popoverData.id = attributeId;
        popoverData.glyphicon = (attributeObj.glyphicon ? this.get('data.attributes')[attributeId].glyphicon : "glyphicon-tag");

        data.attributes.push(popoverData);
      }
    }

    return data;
  }),
  
  init() {
    this._super(...arguments);
    
    let nodes = new vis.DataSet([]);

    let edges = new vis.DataSet([]);

    /* Creates the initial graph */
    for (let video in this.get('data.videos')) {
      let vid = this.get('data.videos')[video];
      let nodeObj = { };

      /* Creates the node object to be added */
      nodeObj.id = video;
      nodeObj.label = this.shortenName(vid.prettyName);

        for (let i = 0; i < vid.relations.length; i++) {
          let attr = this.get('data.attributes')[vid.relations[i].attributeId];
          let diff = vid.relations[i].difficulty;
          let edgeObj = { };

          /* controls colors of the edges */
          let color = this.createRGBcolor(diff);

          /* Creates the edge object to be added */
          edgeObj.from = video;
          edgeObj.to = vid.relations[i].relatedId;
          edgeObj.value = Math.abs(diff);
          edgeObj.pos = i;
          edgeObj.label = this.shortenName(attr.prettyName);
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
  addAttributeObserver: Ember.observer('addAttrToVideoData', function() {
    if (this.get('addAttrToVideoData')) {
      let network = this.get('network');
      let domPos = Ember.copy(this.get('addAttrToVideoData.domPos'));
      
      this.get('getVideoCallback') (network.getNodeAt(domPos), this.get('addAttrToVideoData.attributeId'));
    }//if
  }),
  editAttributeObserver: Ember.observer('editAttributeData', function() {
    if (this.get('editAttributeData')) {
      let attr = this.get('editAttributeData');
      let newLabel = this.shortenName(attr.data.prettyName);
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
      nodeObj.label = this.shortenName(vid.prettyName);
      
      this.get('graphData.nodes').add(nodeObj);
    }//if
  }),
  editVideoObserver: Ember.observer('editVideoData', function() {
    if (this.get('editVideoData')) {
      let vidId = Ember.copy(this.get('editVideoData.videoId'));
      let vid = Ember.copy(this.get('editVideoData.data'));
      let nodeObj = { };

      nodeObj.id = vidId;
      nodeObj.label = this.shortenName(vid.prettyName);
      
      this.get('graphData.nodes').update(nodeObj);
    }
  }),
  panelObservers: Ember.observer('attributesExpanded', 'propertiesExpanded', 'configurationExpanded', function() {
    this.setStyle();
  }),
  actions: {
    addEdgeMode() {
      this.get('network').addEdgeMode();
    },
    deleteEdgeMode() {
      this.set('removeEdgeMode', !this.get('removeEdgeMode'));
    },
    deleteVideoMode() {
      this.set('removeVideoMode', !this.get('removeVideoMode'));
    },
    removeAttribute(videoId, attributeId) {
      if (confirm("Are you sure that you want to remove " +
          this.get('data.attributes')[attributeId].prettyName + " from " +
          this.get('data.videos')[videoId].prettyName + "? This will remove all" +
          " relations this video has. (Cancel for no)")) {
        
        (function IIFE(component) {
          component.get('graphData.edges').forEach(function (edge) {
            if ((edge.from === videoId || edge.to === videoId) && edge.attr === attributeId) {
              component.get('graphData.edges').remove(edge);
            }//if
          });
        })(this);
        
        this.get('removeAttributeCallback') (videoId, attributeId);
      }
    },
    drawGraph() {
      this.setStyle();
      
      let container = this.$('.graph-container')[0];
      let component = this;

      this.set('graphOptions.manipulation.addEdge', function (data, callback) {
        let fromVid = component.get('data.videos')[data.from];
        let toVid = component.get('data.videos')[data.to];
        let attributes = [ ];

        component.set('fromVid', data.from);
        component.set('toVid', data.to);
        component.set('relationsLength', fromVid.relations.length);
        
        if (data.from === data.to) {
          component.get('notify').warning("Warning! Trying to make a relation to the same video.", {
            radius: true,
            closeAfter: null
          });
          
          return;
        }

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
          component.get('notify').warning("Warning! Trying to make a relation between two videos with no shared attributes.", {
            radius: true,
            closeAfter: null
          });
          
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
      .on("deselectNode", function (param) {
        if (param.nodes.length === 0) {
          component.get('videoSelectedCallback') (null);
        }
      })
      .on("hoverNode", function (param) {
        //popover support stuff. built-in support not working.
        let nodePos = this.canvasToDOM(this.getPositions([param.node])[param.node]);
        let el = component.$(".canvas-popover");
        component.set('popoverNodeId', param.node);

        component.set('popoverTitle', component.get('data.videos')[param.node].prettyName);
 
        el.css("left", nodePos.x).css("top", nodePos.y);
        el.removeClass("hidden");
      })
      .on("blurNode", function () {
        component.hidePopover();
      })
      .on("dragStart", function () {
        component.hidePopover();
      })
      .on("click", function (param) {
        component.hidePopover();
        
        if (param.nodes.length === 0) {
          this.disableEditMode();
        }//if
        else if (param.nodes.length === 1) {
          component.get('videoSelectedCallback') (param.nodes[0]);
        }//else if

        if (param.edges.length === 1 && component.get('removeEdgeMode')) {
          let edges = component.get('graphData.edges');
          let edge = edges.get(param.edges[0]);
          
          if (confirm("Are you sure you want to remove the relation between \"" +
                      component.get('data.videos')[edge.from].prettyName +
                      "\" to \"" + component.get('data.videos')[edge.to].prettyName +
                      "\" related by \"" + component.get('data.attributes')[edge.attr].prettyName +
                      "\"?")) {
            edges.remove(edge);
            
            component.set('removeEdgeMode', false);
            component.get('removeRelationCallback') (edge.from, edge.pos);
          }//if
        }//if
        
        if (param.nodes.length === 1 && component.get('removeVideoMode')) {
          if (confirm("Are you sure you want to remove the video \"" + component.get('data.videos')[param.nodes[0]].prettyName + "\"?")) {
            let vidId = param.nodes[0];
              
            component.get('graphData.edges').forEach(function (edge) {
              if (edge.from === vidId || edge.to === vidId) {
                component.get('graphData.edges').remove(edge);
              }//if
            });
            
            component.get('graphData.nodes').remove(vidId);
            component.get('removeVideoCallback') (vidId);
          }//if
          
          component.set('removeVideoMode', false);
        }//if
      });

      this.set('network', network);
    },
    createEdge(data) {
      let attr = this.get('data.attributes')[data.attributeId];
      let diff = data.difficulty;
      let edgeObj = { };
      
      let color = this.createRGBcolor(diff);

      edgeObj.from = this.get('fromVid');
      edgeObj.to = this.get('toVid');
      edgeObj.value = Math.abs(diff);
      edgeObj.pos = this.get('relationsLength');
      edgeObj.label = this.shortenName(attr.prettyName);
      edgeObj.color = color;
      edgeObj.id = edgeObj.from + "_" + this.get('graphData.edges').length;
      edgeObj.title = attr.prettyName;
      edgeObj.attr = data.attributeId;

      this.get('graphData.edges').add(edgeObj);

      if (Ember.$('#addRelationOverlay')) {
        Ember.$('#addRelationOverlay').modal('hide');
      }
      
      this.get('addRelationCallback') (edgeObj, data.attributeId);

      this.get('videoSelectedCallback', edgeObj.from);
      
      this.get('network').selectNodes([edgeObj.from]);
    },
    doNothing() {

    }
  }
});
