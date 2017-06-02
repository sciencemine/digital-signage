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
      shadow: true
    },
    edges: {
      shadow: true,
      arrows: 'to',
      length: 300,
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

  rerender: false,
  fromVid: null,
  toVid: null,

  popoverTitle: null,
  popoverContent: null,
  attributeDrop: null,

  didReceiveAttrs() {
    let nodes = new vis.DataSet([]);

    let edges = new vis.DataSet([]);

    for (let video in this.get('data.videos')) {
      let vid = this.get('data.videos')[video];
      let nodeObj = { };

      nodeObj.id = video;
      nodeObj.label = vid.prettyName.length > 10 ? vid.prettyName.substr(0, 6) + " ..." : vid.prettyName;

        for (let i = 0; i < vid.relations.length; i++) {
          let attr = this.get('data.attributes')[vid.relations[i].attributeId];
          let diff = vid.relations[i].difficulty;
          let edgeObj = { };

          let red = diff > 0 ? 10 * diff : 0;
          let green = diff < 0 ? -10 * diff : 0;
          let blue = 127 - ((red + green) / 2);

          let color = "rgb(" + red + "," + green + "," + blue + ")";

          edgeObj.from = video;
          edgeObj.to = vid.relations[i].relatedId;
          edgeObj.value = Math.abs(diff);
          edgeObj.label = attr.prettyName.length > 10 ? attr.prettyName.substr(0, 6) + " ..." : attr.prettyName;
          edgeObj.color = color;
          edgeObj.id = video + "_" + i;

          edges.add(edgeObj);
        }

      nodes.add(nodeObj);
    }

    if (nodes !== this.get('graphData.nodes')) {
      this.set('graphData.nodes', nodes);
      this.set('graphData.edges', edges);

      this.set('rerender', true);
    }
    else {
      this.set('rerender', false);
    }
  },
  didRender() {
    if (this.get('network') === null) {
      this.send('redrawGraph');
    }
    else if (this.get('rerender')) {
      this.get('network').setData(this.get('graphData'));
    }

    this.set('rerender', false);
  },
  dropObserver: Ember.observer('attributeDrop', function() {
    let network = this.get('network');
    let domPos = Ember.copy(this.get('attributeDrop.location'));

    this.get('getVideoCallback') (network.getNodeAt(domPos));
  }),
  actions: {
    toggleAddEdge() {
      this.get('network').addEdgeMode();
    },
    redrawGraph() {
      let container = this.$('.graph-container')[0];
      let component = this;

      this.set('graphOptions.manipulation.addEdge', function (data, callback) {
        let fromVid = component.get('data.videos')[data.from];
        let toVid = component.get('data.videos')[data.to];
        let attributes = [ ];

        component.set('fromVid', data.from);
        component.set('toVid', data.to);

        for (let fromAttr = 0; fromAttr < fromVid.attributes.length; fromAttr++) {
          let attr = fromVid.attributes[fromAttr];

          if (toVid.attributes.includes(attr)) {
            attr = Ember.copy(component.get('data.attributes')[attr]);
            attr.data = attr.prettyName;
            attr.id = fromVid.attributes[fromAttr];

            attributes.push(attr);
          }
        }

        component.set('relationsConfig.data.attributeId.data', attributes);

        component.$("#addRelationOverlay")
        .on('hide.bs.modal', function () {
          let el = Ember.$("#addRelationOverlay");

          component.set('relationsConfig.data.attributeId.data', [ ]);

          Ember.$("#addRelationOverlay").replaceWith("");
          component.$("#modal-container").append(el);

          component.set('fromVid', null);
          component.set('toVid', null);
        })
        .appendTo('body').modal('show');
      });

      let network = new vis.Network(container, this.get('graphData'), this.get('graphOptions'));

      network
      .on("selectNode", function (params) {
        component.get('videoSelectedCallback') (params.nodes[0]);
      })
      .on("deselectNode", function () {
        component.get('videoSelectedCallback') (null);
      })
      .on("hoverNode", function (param) {
        // popover support stuff. built-in support not working. 
        // let nodePos = this.canvasToDOM(this.getPositions([param.node])[param.node]);
        // let el = component.$(".canvas-popover");

        // component.set('popoverTitle', component.get('data.videos')[param.node].prettyName);
        // component.set('popoverContent', component.get('data.videos')[param.node].description);
 
        // el.css("left", nodePos.x).css("top", nodePos.y);
        // el.removeClass("hidden");
      })
      .on("blurNode", function () {
        component.$(".canvas-popover").addClass("hidden");
      })
      .on("dragStart", function (params) {
        component.$(".canvas-popover").addClass("hidden");
        if (params.nodes.length === 1) {
          component.get('videoSelectedCallback') (params.nodes[0]);
        }
      })
      .on("click", function (params) {
        component.$(".canvas-popover").addClass("hidden");
        if (params.nodes.length === 0) {
          this.disableEditMode();
        }
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
      edgeObj.label = attr.prettyName.length > 10 ? attr.prettyName.substr(0, 6) + " ..." : attr.prettyName;
      edgeObj.color = color;
      edgeObj.id = this.get('fromVid') + "_" + this.get('graphData.edges').length;
      edgeObj.title = attr.prettyName;

      this.get('graphData.edges').add(edgeObj);

      if (Ember.$('#addRelationOverlay')) {
        Ember.$('#addRelationOverlay').modal('hide');
      }

      this.get('addEdgeCallback') (edgeObj, data.attributeId);
    },
    doNothing() {

    }
  }
});