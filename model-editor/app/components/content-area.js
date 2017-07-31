/*******************************************************************************
 * COMPONENT:
 *  content-area
 *
 * DESCRIPTION:
 *  Container for all of the model editor content
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Component.extend({
  notify: service(),
  modelService: service(),
  visData: service(),
  
  /* Parameters used for various things */
  validModel: false,              //Boolean if the model is valid or not
  selectedVideoKey: null,         //Hash key to the selected video 
  selectedVideo: null,            //The selected video object (with replaced
                                    //attributes and relations)
  selectedVideoAttributes: null,  //The selected video's non-processed
                                    //attributes
  selectedVideoRelations: null,   //The selected video's non-processed relations

  /* Modal form information for form overlays */
  modalTitle: "",
  modalConfig: null,
  modalData: null,
  modalPrefix: "",
  modalPath: "",
  modalKey: "",

  /* Payload data for adding an attribute to a video */
  addAttrToVideoData: {
    attributeId: null,
    domPos: {
      x: null,
      y: null
    }
  },
  
  makeFiveDigitId: function(obj) {
    let text;

    do {
      text = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for(var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
    } while (text in obj);

    return text;
  },
  actions: {
    updateModalInfo(title, config, path, key) {
      let modelService = this.get('modelService');
      
      this.setProperties({
        modalTitle: title,
        modalConfig: modelService.get('modelConfig' + config),
        modalData: (path && key ? modelService.get('modelData' + path)[key] : null),
        modalPrefix: title.replace(/\s*/gi, ''),
        modalPath: path,
        modalKey: key
      });
    },
    updateModalAddVideo() {
      this.send('updateModalInfo', "Add Video", '.videos.data.video', '.videos');
    },
    updateModalAddAttribute() {
      this.send('updateModalInfo', "Add Attribute", ".attributes.data.attribute", ".attributes");
    },
    removeVideo(vidId) {
      let modelService = this.get('modelService');
      let modelData = modelService.get('modelData');
      
      for (var attribute in modelData.attributes) {
        modelData.attributes[attribute].videos.removeObject(vidId);
      }
      
      let videos = modelData.videos;
      
      for (var video in videos) {
        let videoObj = videos[video];
        
        for (var i = 0; i < videoObj.relations.length; i++) {
          if (videoObj.relations[i].relatedId === vidId) {
            videoObj.relations.removeAt(i);
          }
        }
      }
      
      delete videos[vidId];
      modelService.update('modelData.videos', videos);
      
      this.send('setSelectedVideo', null);
    },
    updateAddAttrToVideoData(x, y, attributeId) {
      let obj = {
        attributeId: attributeId,
        domPos: {
          x: x,
          y: y
        }
      };

      obj.domPos.x = obj.domPos.x - Ember.$(".vis-network").offset().left;
      obj.domPos.y = obj.domPos.y - Ember.$(".vis-network").offset().top;

      this.set('addAttrToVideoData', obj, attributeId);
    },
    addAttributeToVideo(videoId, attrId) {
      if (videoId) {
        let modelService = this.get('modelService');
        let attributes = modelService.get('modelData.videos')[videoId].attributes;
        
        if (!attributes.find(function(attr) {
          if (attr === attrId) {
            return true;
          }
        })) {
          attributes.pushObject(attrId);
          this.get('modelService').update('modelData.attributes.' + attrId + '.videos', videoId);
          
          this.send('setSelectedVideo', videoId);
          
          (function(component) {
            setTimeout(function() {
              component.notifyPropertyChange('selectedVideo');
            }, 10);
          }) (this);
        }
        else {
          this.get('notify').warning( "This attribute is already associated with this video.", {
            radius: true,
            closeAfter: 10 * 1000
          });
        }
      }
    },
    setSelectedVideo(param) {
      this.set('selectedVideoKey', param);

      if (!param) {
        this.set('selectedVideo', null);
        
        return;
      }
      
      let modelData = this.get('modelService.modelData');

      this.setProperties({
        selectedVideo: Ember.copy(modelData.videos[param]),
        selectedVideoAttributes: Ember.copy(modelData.videos[param].attributes),
        selectedVideoRelations: Ember.copy(modelData.videos[param].relations)
      });
      
      this.send('replaceVideoAttributes');
      this.send('replaceVideoRelations');
    },
    replaceVideoAttributes() {
      let attributes = this.get('selectedVideo.attributes');

      this.set('selectedVideo.attributes', [ ]);

      for (var attribute = 0; attribute < attributes.length; attribute++) {
        let attributeData = Ember.copy(this.get('modelService.modelData.attributes')[attributes[attribute]]);
        let data = { };

        data.name = attributeData.prettyName;
        data.description = attributeData.description;
        data.key = attributes[attribute];

        this.get('selectedVideo.attributes').push(data);
      }
    },
    replaceVideoRelations() {
      let relations = this.get('selectedVideo.relations');
      let modelData = this.get('modelService.modelData');

      this.set('selectedVideo.relations', [ ]);

      for (var relation = 0; relation < relations.length; relation++) {
        let data = { };
        let relatedVid = Ember.copy(modelData.videos[relations[relation].relatedId]);

        data.name = relatedVid.prettyName;
        data.description = relatedVid.description;
        data.difficulty = relations[relation].difficulty;
        data.attribute = Ember.copy(modelData.attributes[relations[relation].attributeId].prettyName);
        data.key = relation;

        this.get('selectedVideo.relations').push(data);
      }
    },
    validateConfig(param) {
      this.set('validModel', this.get('validModel') || param);
    },
    updateConfig(data) {
      this.get('modelService').update('modelData.config', data);
    },
    updateData(data, path, key) {
      let modelService = this.get('modelService');
      let newKey;
      
      if (key) {
        path = path + "." + key;
      }
      else {
        newKey = this.makeFiveDigitId(modelService.get('modelData' + path));
        path = path + "." + newKey;
      }

      if (path.indexOf(".videos") !== -1) {
        let id = (key ? key : newKey);
        
        if (key) {
          this.get('visData').updateNode({ id: id, label: data.prettyName });
        }
        else {
          this.get('visData').createNode(id, data.prettyName);
        }//else
      }

      if (path.indexOf(".attributes") !== -1) {
        let obj = { data: { } };
        let attrId = (key ? key : newKey);
        
        obj.attributeId = (key ? key : newKey);
        obj.data = data;
        
        if (key) {
          let visData = this.get('visData');
          
          data.videos = Ember.copy(modelService.get('modelData.attributes')[key].videos);
          
          visData.get('edges').forEach(function(edge) {
            if (edge.id.substr(edge.id.lastIndexOf('_') + 1) === attrId) {
              let newEdge = edge;
          
              newEdge.label = data.prettyName;
              
              visData.updateEdge(newEdge);
            }
          });
        }
      }

      modelService.update('modelData' + path, data);

      if (this.get('selectedVideoKey')) {
        this.send('setSelectedVideo', this.get('selectedVideoKey'));
      }

      if (this.$('#formOverlay')) {
        this.$('#formOverlay').modal('hide');
      }

      this.setProperties({
        modalTitle: null,
        modalConfig: null,
        modalData: null,
        modalPrefix: null
      });
    },
    deleteAttribute(attributeId) {
      let modelService = this.get('modelService');
      let attributes = Ember.copy(modelService.get('modelData.attributes'));

      for (var i = 0; i < attributes[attributeId].videos.length; i++) {
        let vidId = attributes[attributeId].videos[i];
        let vid = modelService.get('modelData').videos[vidId];

        vid.attributes.removeObject(attributeId);

        for (var j = 0; j < vid.relations.length; j++) {
          let relation = vid.relations[j];

          if (relation.attributeId === attributeId) {
            vid.relations.removeObject(relation);
          }
        }
      }
      
      delete attributes[attributeId];
      
      modelService.update('modelData.attributes', attributes);

      if (this.get('selectedVideoKey')) {
        this.send('setSelectedVideo', this.get('selectedVideoKey'));
      }
    },
    saveModel() {
      if (!this.get('validModel')) {
        this.get('notify').alert("Please verify information in the configuration section.", {
          radius: true,
          closeAfter: 10 * 1000
        });

        return;
      }
      
      this.get('modelService').saveModel();
    },
    doNothing() {

    }
  }
});
