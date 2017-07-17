import Ember from 'ember';
import vis from 'npm:vis';

const { inject: { service } } = Ember;

export default Ember.Component.extend({
  notify: service(),
  modelService: service(),
  panelStates: service(),
  visData: service(),
  
  classNames: ['graph-area'],
  classNameBindings: [],

  /* The actual graph */
  network: null,

  /* For adding edges */
  fromVid: null,
  toVid: null,
  relationsLength: null,
  relationsConfig: null,
  
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
  setStyle: function() {
    let panelStates = this.get('panelStates');
    let el = Ember.$("#" + this.elementId);
    let width = Ember.$(window).width();
    let titleBottom = Ember.$("#content-area--header").height() +
                 Ember.$("#content-area--header").offset().top +
                 parseInt(Ember.$("#content-area--header").css('paddingBottom'));
    
    el.css('top', titleBottom);
    el.css('right', (panelStates.get('propertiesExpanded') ? width - Ember.$("#properties-panel").offset().left : 0));
    el.css('left', (panelStates.get('attributesExpanded') ? Ember.$("#attribute-panel").width() : 0));
    el.css('bottom', Ember.$("#configuration-panel").height());
    
    setTimeout(function() {
      el.css('bottom', Ember.$("#configuration-panel").height());
    }, 10);
  },
  init() {
    this._super(...arguments);
    
    let data = this.get('modelService.modelData');
    let visData = this.get('visData');

    /* Creates the initial graph */
    for (let video in data.videos) {
      let vid = data.videos[video];
      let nodeObj = { };

      /* Creates the node object to be added */
      nodeObj.id = video;
      nodeObj.label = this.shortenName(vid.prettyName);

        for (let i = 0; i < vid.relations.length; i++) {
          let attr = data.attributes[vid.relations[i].attributeId];
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

          visData.loadEdges(edgeObj);
        }//for

      visData.loadNodes(nodeObj);
    }//for
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
      let visData = this.get('visData');
      
      visData.edges.forEach(function (edge) {
        if (edge.id.substr(edge.id.lastIndexOf('_') + 1) === attr.attributeId) {
          let newAttr = edge;
          
          newAttr.label = newLabel;
          
          visData.updateEdge(newAttr);
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
      
      this.get('visData').loadNodes(nodeObj);
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
  panelObservers: Ember.observer('panelStates.attributesExpanded', 'panelStates.propertiesExpanded', 'panelStates.configExpanded', function() {
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
      let data = this.get('modelService.modelData');
      
      if (confirm("Are you sure that you want to remove " +
          data.attributes[attributeId].prettyName + " from " +
          data.videos[videoId].prettyName + "? This will remove all" +
          " relations this video has. (Cancel for no)")) {
        
        (function(component) {
          component.get('graphData.edges').forEach(function (edge) {
            if ((edge.from === videoId || edge.to === videoId) && edge.attr === attributeId) {
              component.get('graphData.edges').remove(edge);
            }//if
          });
        }) (this);
        
        this.get('removeAttributeCallback') (videoId, attributeId);
      }
    },
    drawGraph() {
      this.setStyle();
      
      let container = this.$('.graph-container')[0];
      let component = this;
      let modelData = this.get('modelService.modelData');
      let visData = this.get('visData');

      visData.set('options.manipulation.addEdge', function(data, callback) {
        let fromVid = modelData.videos[data.from];
        let toVid = modelData.videos[data.to];
        let attributes = [ ];

        component.set('fromVid', data.from);
        component.set('toVid', data.to);
        component.set('relationsLength', fromVid.relations.length);
        
        if (data.from === data.to) {
          component.get('notify').warning("Warning! Trying to make a relation to the same video.", {
            radius: true,
            closeAfter: 10 * 1000
          });
          
          return;
        }

        for (let fromAttr = 0; fromAttr < fromVid.attributes.length; fromAttr++) {
          let attr = fromVid.attributes[fromAttr];

          if (toVid.attributes.includes(attr)) {
            attr = Ember.copy(modelData.attributes[attr]);
            attr.data = attr.prettyName;
            attr.id = fromVid.attributes[fromAttr];

            attributes.push(attr);
          }//if
        }//for
        
        if (attributes.length === 0) {
          component.get('notify').warning("Warning! Trying to make a relation between two videos with no shared attributes.", {
            radius: true,
            closeAfter: 10 * 1000
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
      
      let graphData = {
        nodes: visData.get('nodes'),
        edges: visData.get('edges')
      };

      let network = new vis.Network(container, graphData, visData.get('options'));

      network
      .on("deselectNode", function (param) {
        if (param.nodes.length === 0) {
          component.get('videoSelectedCallback') (null);
        }
      })
      .on("click", function (param) {
        if (param.nodes.length === 0) {
          this.disableEditMode();
        }//if
        else if (param.nodes.length === 1) {
          component.get('videoSelectedCallback') (param.nodes[0]);
        }//else if

        if (param.edges.length === 1 && component.get('removeEdgeMode')) {
          let edges = visData.get('edges');
          let edge = edges.get(param.edges[0]);
        
          if (confirm("Are you sure you want to remove the relation between \"" +
                      modelData.videos[edge.from].prettyName +
                      "\" to \"" + modelData.videos[edge.to].prettyName +
                      "\" related by \"" + modelData.attributes[edge.attr].prettyName +
                      "\"?")) {
            edges.remove(edge);
            
            component.set('removeEdgeMode', false);
            component.get('removeRelationCallback') (edge.from, edge.pos);
          }//if
        }//if
        
        if (param.nodes.length === 1 && component.get('removeVideoMode')) {
          if (confirm("Are you sure you want to remove the video \"" + modelData.videos[param.nodes[0]].prettyName + "\"?")) {
            let vidId = param.nodes[0];
            let edges = visData.get('edges');
              
            edges.forEach(function(edge) {
              if (edge.from === vidId || edge.to === vidId) {
                visData.removeEdge(edge);
              }//if
            });
            
            visData.removeNode(vidId);
            component.get('removeVideoCallback') (vidId);
          }//if
          
          component.set('removeVideoMode', false);
        }//if
      });

      this.set('network', network);
    },
    createEdge(data) {
      let attr = this.get('modelService.modelData.attributes')[data.attributeId];
      let visData = this.get('visData');
      let diff = data.difficulty;
      let edgeObj = { };

      edgeObj.from = this.get('fromVid');
      edgeObj.to = this.get('toVid');
      edgeObj.value = Math.abs(diff);
      edgeObj.diff = diff;
      edgeObj.pos = this.get('relationsLength');
      edgeObj.label = this.shortenName(attr.prettyName);
      edgeObj.color = this.createRGBcolor(diff);
      edgeObj.id = edgeObj.from + "_" + visData.get('edges').length;
      edgeObj.title = attr.prettyName;
      edgeObj.attr = data.attributeId;

      if (Ember.$('#addRelationOverlay')) {
        Ember.$('#addRelationOverlay').modal('hide');
      }

      visData.loadEdges(edgeObj);
      
      this.get('addRelationCallback') (edgeObj, data.attributeId);

      this.get('videoSelectedCallback', edgeObj.from);
      
      this.get('network').selectNodes([edgeObj.from]);
      
      if (data.biDirectional) {
        let fromVid = edgeObj.from;
        let component = this;
        
        edgeObj.from = edgeObj.to;
        edgeObj.to = fromVid;
        edgeObj.diff = -edgeObj.diff;
        edgeObj.pos = this.get('relationsLength');
        edgeObj.color = this.createRGBcolor(edgeObj.diff);

        setTimeout(function() {
          edgeObj.id = edgeObj.from + "_" + visData.get('edges').length;
          
          visData.loadEdges(edgeObj);
          
          component.get('addRelationCallback') (edgeObj, edgeObj.attr);
        });
      }
    },
    doNothing(data) {
      
    }
  }
});
