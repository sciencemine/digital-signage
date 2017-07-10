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

export default Ember.Component.extend({
  notify: Ember.inject.service(),
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

  init() {
    this._super(...arguments);
    
    this.set('newModel', this.get('data.modelData'));
  },
  actions: {
    updateModalInfo(title, config, path, key) {
      this.setProperties({
        modalTitle: title,
        modalConfig: this.get('data.modelConfig' + config),
        modalData: (path && key ? this.get('newModel' + path)[key] : null),
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

      this.send('pushData', obj, ".videos." + data.from + ".relations");

      this.send('setSelectedVideo', data.from);
    },
    removeRelation(vidId, pos) {
      this.get('newModel.videos')[vidId].relations.removeAt(pos);
    },
    removeVideo(vidId) {
      let videos = this.get('newModel.videos');
      
      for (var attribute in this.get('newModel.attributes')) {
        this.get('newModel.attributes')[attribute].videos.removeObject(vidId);
      }//for
      
      for (var video in videos) {
        let videoObj = videos[video];
        
        for (var i = 0; i < videoObj.relations.length; i++) {
          if (videoObj.relations[i].relatedId === vidId) {
            videoObj.relations.removeAt(i);
          }//if
        }//for
      }//for
      
      delete videos[vidId];
      this.set('newModel.videos', videos);
    },
    /***************************************************************************
     * ACTION:
     *  updateAddAttrToVideoData
     *
     * DESCRIPTION:
     *  Updates the addAttrToVideoData payload
     *
     * PARAMETERS:
     *  x - The x position in the dom
     *  y - The y position in the dom
     *  attributeId - The attribute Id that is getting added
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
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
    /***************************************************************************
     * ACTION:
     *  addAttributeToVideo
     *
     * DESCRIPTION:
     *  Adds an attribute to the video and adds the video to the list of videos
     *    that has the attribute in attributes
     *
     * PARAMETERS:
     *  videoId - The key of the video that is getting added
     *  attrId - The attribute that is getting added
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    addAttributeToVideo(videoId, attrId) {
      if (videoId) {
        
        this.get('newModel.videos')[videoId].attributes.pushObject(attrId);
        this.get('newModel.attributes')[attrId].videos.pushObject(videoId);
        
        this.send('setSelectedVideo', videoId);
        
        (function(component) {
          setTimeout(function() {
            component.notifyPropertyChange('selectedVideo');
          }, 10);
        }) (this);
      }
    },
    removeAttributeFromVideo(videoId, attrId) {
      this.get('newModel.videos')[videoId].attributes.removeObject(attrId);
      this.get('newModel.attributes')[attrId].videos.removeObject(videoId);
      
      (function(component) {
        setTimeout(function() {
          component.notifyPropertyChange('selectedVideo');
        }, 10);
      }) (this);
    },
    setAttributesExpanded(param) {
      this.set('attributesExpanded', param);
    },
    setPropertiesExpanded(param) {
      this.set('propertiesExpanded', param);
    },
    setConfigurationExpanded(param) {
      this.set('configurationExpanded', param);
    },
    /***************************************************************************
     * ACTION:
     *    setSelectedVideo
     *
     * DESCRIPTION:
     *  Sets the selected video to be the video at the given key location. 
     *    Replaces the attributes and relations objects with pretty data for
     *    display purposes. Saves the initial attributes and relations data 
     *    objects for reconstruction later
     *
     * PARAMETERS:
     *  param - The key of the video that is currently selected
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    setSelectedVideo(param) {
      this.set('selectedVideoKey', param);

      if (!param) {
        this.set('selectedVideo', null);
        
        return;
      }

      this.setProperties({
        selectedVideo: Ember.copy(this.get('newModel.videos')[param]),
        selectedVideoAttributes: Ember.copy(this.get('newModel.videos')[param].attributes),
        selectedVideoRelations: Ember.copy(this.get('newModel.videos')[param].relations)
      });
      
      this.send('replaceVideoAttributes');
      this.send('replaceVideoRelations');
    },
    replaceVideoAttributes() {
      let attributes = this.get('selectedVideo.attributes');

      this.set('selectedVideo.attributes', [ ]);

      for (var attribute = 0; attribute < attributes.length; attribute++) {
        let attributeData = Ember.copy(this.get('newModel.attributes')[attributes[attribute]]);
        let data = { };

        data.name = attributeData.prettyName;
        data.description = attributeData.description;
        data.key = attributes[attribute];

        this.get('selectedVideo.attributes').push(data);
      }
    },
    replaceVideoRelations() {
      let relations = this.get('selectedVideo.relations');

      this.set('selectedVideo.relations', [ ]);

      for (var relation = 0; relation < relations.length; relation++) {
        let data = { };
        let relatedVid = Ember.copy(this.get('newModel.videos')[relations[relation].relatedId]);

        data.name = relatedVid.prettyName;
        data.description = relatedVid.description;
        data.difficulty = relations[relation].difficulty;
        data.attribute = Ember.copy(this.get('newModel.attributes')[relations[relation].attributeId].prettyName);
        data.key = relation;

        this.get('selectedVideo.relations').push(data);
      }
    },
    validateConfig(param) {
      this.set('validModel', this.get('validModel') || param);
    },
    updateConfig(data) {
      this.set('newModel.config', data);
    },
    updateData(data, path, key) {
      let newKey;
      
      if (key) {
        path = path + "." + key;
      }
      else {
        newKey = this.makeFiveDigitId(this.get('newModel' + path));
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
          data.videos = Ember.copy(this.get('newModel.attributes')[key].videos);
          obj.data.oldPrettyName = Ember.copy(this.get('newModel.attributes')[key].prettyName);
          this.set('editAttributeData', obj);
        }//if
      }//if

      this.set('newModel' + path, data);

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
      
      (function(component) {
        setTimeout(function() {
          component.notifyPropertyChange('newModel');
        }, 20);
      })(this);
    },
    pushData(data, path) {
      this.get('newModel' + path).pushObject(data);
    },
    deleteAttribute(attributeId) {
      let attributes = Ember.copy(this.get('newModel.attributes'));

      for (var i = 0; i < this.get('newModel.attributes')[attributeId].videos.length; i++) {
        let vidId = this.get('newModel.attributes')[attributeId].videos[i];
        let vid = this.get('newModel.videos')[vidId];

        vid.attributes.removeObject(attributeId);

        for (var j = 0; j < vid.relations.length; j++) {
          let relation = vid.relations[j];

          if (relation.attributeId === attributeId) {
            vid.relations.removeObject(relation);
          }//if
        }//for
      }//for
      
      delete attributes[attributeId];
      
      this.set('newModel.attributes', attributes);

      if (this.get('selectedVideoKey')) {
        this.send('setSelectedVideo', this.get('selectedVideoKey'));
      }//if
    },
    saveModel() {
      if (!this.get('validModel')) {
        this.get('notify').alert("Please verify information in the configuration section.", {
          radius: true,
          closeAfter: null
        });

        return;
      }

      let prettyName = this.get('newModel.config.prettyName');

      let download = confirm("Do you want to download the exhibit model for " +
                              prettyName + "? (Cancel for no).");
      
      if (download) {
        let modelData = this.get('newModel');

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
