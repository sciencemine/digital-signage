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

  init() {
    this._super(...arguments);

    this.set('newModel', this.get('data.modelData'));
  },
  actions: {
    /***************************************************************************
     * ACTION:
     *  updateModalInfo
     *
     * DESCRIPTION:
     *  Sets the modal information according to the parameters given
     *
     * PARAMETERS:
     *  title - The title of the new modal that is to be displayed
     *  config - A configuration object to format the modal
     *  path - The path to where the submitted data is to be stored in newModel
     *  key - Key at the path destination to store the data. Used for updates.
     *    This is optional
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    updateModalInfo(title, config, path, key) {
      this.set('modalTitle', title);
      this.set('modalConfig', this.get('data.modelConfig' + config));
      this.set('modalData', (path && key ? this.get('newModel' + path)[key] : null));
      this.set('modalPrefix', title.replace(/\s*/gi, ''));
      this.set('modalPath', path);
      this.set('modalKey', key);
    },
    /***************************************************************************
     * ACTION:
     *  updateModalAddVideo
     *
     * DESCRIPTION:
     *  Sends to updateModalInfo the proper parameters for adding a video
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    updateModalAddVideo() {
      this.send('updateModalInfo', "Add Video", '.videos.data.video', '.videos');
    },
    /***************************************************************************
     * ACTION:
     *  updateModalAddAttribute
     *
     * DESCRIPTION:
     *  Sends to updateModalInfo the proper parameters for adding an attribute
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    updateModalAddAttribute() {
      this.send('updateModalInfo', "Add Attribute", ".attributes.data.attribute", ".attributes");
    },
    /***************************************************************************
     * ACTION:
     *  addRelation
     *
     * DESCRIPTION:
     *  Adds a relation to a video
     *
     * PARAMETERS:
     *  data - Data containing the following hash keys
     *    from - The starting video in the relation
     *    relatedId - The ending video in the relation
     *    difficulty - The difficulty of the relation
     *
     *  attrId - The attribute on the relation
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    addRelation(data, attrId) {
      let obj = { };
      
      obj.relatedId = data.to;
      obj.difficulty = data.value;
      obj.attributeId = attrId;

      this.send('pushData', obj, ".videos." + data.from + ".relations");

      this.send('setSelectedVideo', data.from);
    },
    /***************************************************************************
     * ACTION:
     *  removeRelation
     *
     * DESCRIPTION:
     *  Removes a relation from a video
     *
     * PARAMETERS:
     *  vidId - The video from which the relation should be removed
     *  pos - The position in the relations array that should be removed
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    removeRelation(vidId, pos) {
      this.get('newModel.videos')[vidId].relations.removeAt(pos);
    },
    /***************************************************************************
     * ACTION:
     *  removeVideo
     *
     * DESCRIPTION:
     *  Removes a video from the model
     *
     * PARAMETERS:
     *  vidId - The video to be removed
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 9th, 2017
     **************************************************************************/
    removeVideo(vidId) {
      let videos = this.get('newModel.videos');
      
      for (var attribute in this.get('newModel.attributes')) {
        this.get('newModel.attributes')[attribute].videos.removeObject(vidId);
      }//for
      
      for (var video in videos) {
        let videoObj = videos[video];
        
        for (var i = 0; i < videoObj.relations.length; i++) {
          if (videoObj.relations[i].relatedId === vidId) {
            videos[video].relations.removeAt(i);
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
        let component = this;
        
        this.get('newModel.videos')[videoId].attributes.pushObject(attrId);
        this.get('newModel.attributes')[attrId].videos.pushObject(videoId);
        this.send('setSelectedVideo', videoId);
        
        setTimeout(function() {
          component.notifyPropertyChange('selectedVideo');
        }, 10);
      }
    },
    /***************************************************************************
     * ACTION:
     *  setAttributesExpanded
     *
     * DESCRIPTION:
     *  Sets the attributesExpanded to the parameter given
     *
     * PARAMETERS:
     *  param - Boolean for if the attributes panel is expanded or not
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    setAttributesExpanded(param) {
      this.set('attributesExpanded', param);
    },
    /***************************************************************************
     * ACTION:
     *  setPropertiesExpanded
     *
     * DESCRIPTION:
     *  Sets the propertiesExpanded to the parameter given
     *
     * PARAMETERS:
     *  param - Boolean for if the properties panel is expanded or not
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    setPropertiesExpanded(param) {
      this.set('propertiesExpanded', param);
    },
    /***************************************************************************
     * ACTION:
     *  setConfigurationExpanded
     *
     * DESCRIPTION:
     *  Sets the configurationExpanded to the parameter given
     *
     * PARAMETERS:
     *  param - Boolean for if the configuration panel is expanded or not
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
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

      this.set('selectedVideo', Ember.copy(this.get('newModel.videos')[param]));
      this.set('selectedVideoAttributes', Ember.copy(this.get('newModel.videos')[param].attributes));
      this.set('selectedVideoRelations', Ember.copy(this.get('newModel.videos')[param].relations));
      this.send('replaceVideoAttributes');
      this.send('replaceVideoRelations');
    },
    /***************************************************************************
     * ACTION:
     *  replaceVideoAttributes
     *
     * DESCRIPTION:
     *  Replaces the attributes of the currently selected video with nice
     *    processed data that can be displayed
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
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
    /***************************************************************************
     * ACTION:
     *  replaceVideoRelations
     *
     * DESCRIPTION:
     *  Replaces the relations of the currently selected video with nice
     *    processed data that can be displayed
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
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
    /***************************************************************************
     * ACTION:
     *  validateConfig
     *
     * DESCRIPTION:
     *  Sets validModel to be valid if the parameter is valid or if it were 
     *    previously valid. Note that validModel is initially false. Also note
     *    that once a model is valid, form validation prevents model from
     *    entering into an invalid state
     *
     * PARAMETERS:
     *  param - If the model is valid or not
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    validateConfig(param) {
      this.set('validModel', this.get('validModel') || param);
    },
    /***************************************************************************
     * ACTION:
     *  configUpdate
     *
     * DESCRIPTION:
     *  Handles updating the configuration data in the model with new content.
     *
     * PARAMETERS:
     *  data - The data new configuration data that is going to be set.
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    configUpdate(data) {
      this.set('newModel.config', data);
    },
    /***************************************************************************
     * ACTION:
     *  dataUpdate
     *
     * DESCRIPTION:
     *  Handles updating data in the model that is not config data
     *
     * PARAMETERS:
     *  data - The new data to be added
     *  path - The path to the location to add the new data in newModel
     *  key - The key to update. This is optional
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    dataUpdate(data, path, key) {
      let newKey;
      
      if (key) {
        path = path + "." + key;
      }
      else {
        newKey = makeId(this.get('newModel' + path));
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

      this.set('modalTitle', null);
      this.set('modalConfig', null);
      this.set('modalData', null);
      this.set('modalPrefix', null);

      this.notifyPropertyChange('newModel');
    },
    /***************************************************************************
     * ACTION:
     *  pushData
     *
     * DESCRIPTION:
     *  Pushes data to an array in the model. This is for adding a new attribute
     *    or relation
     *
     * PARAMETERS:
     *  data - The data that is getting pushed
     *  path - The path to where the data should be added
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    pushData(data, path) {
      this.get('newModel' + path).pushObject(data);
    },
    /***************************************************************************
     * ACTION:
     *  deleteAttribute
     *
     * DESCRIPTION:
     *  Deletes an attribute from the list of attributes
     * 
     * PARAMETERS:
     *  attributeId - The id of the attribute that is to be removed
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
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
    /***************************************************************************
     * ACTION:
     *  saveModel
     *
     * DESCRIPTION:
     *  Saves the model. Will only save if validModel is true. Will prompt the
     *  user for a filename.
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    saveModel() {
      if (!this.get('validModel')) {
        alert("Please verify information in the configuration section.");

        return;
      }

      let prettyName = this.get('newModel.config.prettyName');

      let download = confirm("Do you want to download the exhibit model for " + prettyName + "?");

      if (download) {
        let filename = prompt("Enter filename:") + ".json";

        let a = document.createElement('a');

        a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(JSON.stringify(this.get('newModel'))));

        a.setAttribute('download', filename);

        a.click();
      }
    },
    /***************************************************************************
     * ACTION:
     *  doNothing
     *
     * DESCRIPTION:
     *  This does nothing. Basically a null action
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    doNothing() {

    }
  }
});

/*******************************************************************************
 * FUNCTION:
 *  makeId
 *
 * DESCRIPTION:
 *  Creates a unique hash key in an object
 *
 * PARAMETERS:
 *  obj - The object to make a unique key in
 * 
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
function makeId(obj) {
  let text;

  do {
    text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  } while (text in obj);

  return text;
}
