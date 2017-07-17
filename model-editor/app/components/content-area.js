/*******************************************************************************
 * COMPONENT:
 *  content-area
 *
 * DESCRIPTION:
 *  Container for all of the model editor content
 * 
 * PARAMETERS:
 *  data - A data object with the following properties
 *    modelConfig - The configuration model for the current version
 *    modelData - The valid model for the current version
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
  
  /* Parameters used for various things */
  newModel: null,                 //A copy of the model to edit
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

  /* Booleans for detecting if any of the panels are open or closed */
  attributesExpanded: true,
  propertiesExpanded: true,
  configurationExpanded: true,

  /* Payload data for adding an attribute to a video */
  addAttrToVideoData: {
    attributeId: null,
    domPos: {
      x: null,
      y: null
    }
  },
  
  /* Payload data for editing an existing attribute */
  editAttributeData: {
    attributeId: null,
    data: { }
  },
  
  /* Payload data for adding a new video */
  addVideoData: {
    videoId: null,
    data: { }
  },
  
  /* Payload data for editing an existing video */
  editVideoData: {
    videoId: null,
    data: { }
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
    addRelation(data, attrId) {
      let obj = { };
      
      obj.relatedId = data.to;
      obj.difficulty = data.diff;
      obj.attributeId = attrId;

      // this.get('modelService').update("modelData.videos." + data.from + ".relations", obj);

      // this.send('setSelectedVideo', data.from);
    },
    removeRelation(vidId, pos) {
      this.get('modelService.modelData.videos')[vidId].relations.removeAt(pos);
    },
    removeVideo(vidId) {
      let modelData = this.get('modelService.modelData');
      
      for (var attribute in modelData.attributes) {
        modelData.attributes[attribute].videos.removeObject(vidId);
      }//for
      
      let videos = modelData.videos;
      
      for (var video in videos) {
        let videoObj = videos[video];
        
        for (var i = 0; i < videoObj.relations.length; i++) {
          if (videoObj.relations[i].relatedId === vidId) {
            videoObj.relations.removeAt(i);
          }//if
        }//for
      }//for
      
      delete videos[vidId];
      this.get('modelService').update('modelData.videos', videos);
      
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
    removeAttributeFromVideo(videoId, attrId) {
      let modelService = this.get('modelService');
      
      modelService.remove('modelData.videos.' + videoId + '.attributes', attrId);
      modelService.remove('modelData.attributes.' + attrId +  '.videos', videoId);
      
      (function(component) {
        setTimeout(function() {
          component.notifyPropertyChange('selectedVideo');
        }, 10);
      }) (this);
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
        let obj = { data: { } };
        
        obj.videoId = key ? key : newKey;
        obj.data = data;
        
        if (key) {
          this.set('editVideoData', obj);
        }//if
        else {
          this.set('addVideoData', obj);
        }//else
      }//if

      if (path.indexOf(".attributes") !== -1) {
        let obj = { data: { } };
        
        obj.attributeId = key ? key : newKey;
        obj.data = data;
        
        if (key) {
          data.videos = Ember.copy(modelService.get('modelData.attributes')[key].videos);
          obj.data.oldPrettyName = Ember.copy(modelService.get('modelData.attributes')[key].prettyName);
          this.set('editAttributeData', obj);
        }//if
      }//if

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
          }//if
        }//for
      }//for
      
      delete attributes[attributeId];
      
      modelService.update('modelData.attributes', attributes);

      if (this.get('selectedVideoKey')) {
        this.send('setSelectedVideo', this.get('selectedVideoKey'));
      }//if
    },
    saveModel() {
      if (!this.get('validModel')) {
        this.get('notify').alert("Please verify information in the configuration section.", {
          radius: true,
          closeAfter: 10 * 1000
        });

        return;
      }

      let modelData = this.get('modelService.modelData');
      let prettyName = modelData.config.prettyName;
      let download = confirm("Do you want to download the exhibit model for " +
                              prettyName + "? (Cancel for no).");
      
      if (download) {
        let a = document.createElement('a');

        a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(JSON.stringify(modelData)));

        a.setAttribute('download', prettyName.replace(/\s/gi, '') + ".json");

        a.click();
      }//if
    },
    doNothing() {

    }
  }
});
