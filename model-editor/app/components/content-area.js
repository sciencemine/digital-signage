import Ember from 'ember';

export default Ember.Component.extend({
  newModel: null,
  validModel: false,
  selectedVideoKey: null,
  selectedVideo: null,
  selectedVideoAttributes: null,
  selectedVideoRelations: null,

  modalTitle: "",
  modalConfig: null,
  modalData: null,
  modalPrefix: "",
  modalPath: "",
  modalKey: "",

  attributesExpanded: true,
  propertiesExpanded: true,
  configurationExpanded: true,

  addAttributeData: {
    attributeId: null,
    location: {
      x: null,
      y: null
    }
  },
  editAttributeData: {
    attributeId: null,
    data: {
      
    }
  },
  addVideoData: {
    videoId: null,
    data: { }
  },
  editVideoData: {
    videoId: null,
    data: { }
  },

  init() {
    this._super(...arguments);

    this.set('newModel', this.get('data.modelData'));
  },
  actions: {
    updateModalInfo(title, config, path, key) {
      this.set('modalTitle', title);
      this.set('modalConfig', this.get('data.modelConfig' + config));
      this.set('modalData', (key ? this.get('newModel' + path)[key] : null));
      this.set('modalPrefix', title.replace(/\s*/gi, ''));
      this.set('modalPath', path);
      this.set('modalKey', key);
    },
    addVideo() {
      this.send('updateModalInfo', "Add Video", '.videos.data.video', '.videos');
    },
    editRelation(relationKey) {
      this.set('modalTitle', "Edit Relation");
      this.set('modalConfig', this.get('data.modelConfig.videos.data.video.data.relations.data.relation'));
      this.set('modalData', this.get('newModel.videos')[this.get('selectedVideoKey')].relations[relationKey]);
      this.set('modalPrefix', 'relation');
    },
    addAttribute() {
      this.send('updateModalInfo', "Add Attribute", ".attributes.data.attribute", ".attributes");
    },
    addEdge(data, attrId) {
      let obj = { };
      obj.relatedId = data.to;
      obj.difficulty = data.value;
      obj.attributeId = attrId;

      this.send('pushData', obj, ".videos." + data.from + ".relations");

      this.send('setSelectedVideo', data.from);
    },
    removeEdge(vidId, pos) {
      this.get('newModel.videos')[vidId].relations.removeAt(pos);
    },
    updateAddAttributeData(x, y, attributeId) {
      let obj = {
        attributeId: attributeId,
        location: {
          x: x,
          y: y
        }
      };

      obj.location.x = obj.location.x - Ember.$(".vis-network").offset().left;
      obj.location.y = obj.location.y - Ember.$(".vis-network").offset().top;

      this.set('addAttributeData', obj);
    },
    addAttributeToVideo(videoId) {
      let vidId = Ember.copy(videoId);
      
      if (vidId) {
        let component = this;
        let attrId = Ember.copy(this.get('addAttributeData.attributeId'));
        
        this.get('newModel.videos')[vidId].attributes.pushObject(attrId);
        this.get('newModel.attributes')[attrId].videos.pushObject(videoId);
        this.send('setSelectedVideo', vidId);
        
        setTimeout(function() {
          component.notifyPropertyChange('selectedVideo');
        }, 10);
      }
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
    configUpdate(data, path) {
      this.set('newModel' + path, data);

      return false;
    },
    validateConfig(param) {
      this.set('validModel', this.get('validModel') || param);
    },
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

      return false;
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
          }
        }
      }
      
      delete attributes[attributeId];
      this.set('newModel.attributes', attributes);

      if (this.get('selectedVideoKey')) {
        this.send('setSelectedVideo', this.get('selectedVideoKey'));
      }
    },
    doNothing() {

    },
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
    }
  }
});

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
