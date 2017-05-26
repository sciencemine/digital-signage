import Ember from 'ember';

export default Ember.Component.extend({
  newModel: null,
  selectedVideo: null,
  selectedVideoKey: null,
  modalTitle: "",
  modalConfig: null,
  modalData: null,
  modalPrefix: "",
  modalPath: "",
  modalKey: "",
  attributesExpanded: true,
  propertiesExpanded: true,

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
    setAttributesExpanded(param) {
      this.set('attributesExpanded', param);
    },
    setPropertiesExpanded(param) {
      this.set('propertiesExpanded', param);
    },
    setSelectedVideo(param) {
      this.set('selectedVideo', Ember.copy(this.get('newModel.videos')[param]));
      this.set('selectedVideoKey', param);
      this.send('replaceVideoAttributes');
      this.send('replaceVideoRelations');
    },
    replaceVideoAttributes() {
      let attributes = this.get('selectedVideo.attributes');

      this.set('selectedVideo.attributes', [ ]);

      for (var attribute = 0; attribute < attributes.length; attribute++) {
        let attributeData = this.get('newModel.attributes')[attributes[attribute]];
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
        let relatedVid = this.get('newModel.videos')[relations[relation].relatedId];

        data.name = relatedVid.prettyName;
        data.description = relatedVid.description;
        data.difficulty = relations[relation].difficulty;
        data.attribute = this.get('newModel.attributes')[relations[relation].attributeId].prettyName;
        data.key = relation;

        this.get('selectedVideo.relations').push(data);
      }
    },
    configUpdate(data, path) {
      this.set('newModel' + path, data);

      return false;
    },
    dataUpdate(data, path, key) {console.log(data, path, key)
      let newPath = 'newModel' + path;

      if (key) {
        newPath = newPath + "." + key;
      }
      else {
        newPath = newPath + "." + makeId(this.get('newModel' + path));
      }

      this.set(newPath, data);

      if (this.get('selectedVideoKey')) {
        this.send('setSelectedVideo', this.get('selectedVideoKey'));
      }

      if (this.$('#formOverlay')) {
        this.$('#formOverlay').modal('hide');
      }

      return false;
    },
    deleteAttribute(attributeId) {
      let attributes = Ember.copy(this.get('newModel.attributes'));

      for (var i = this.get('newModel.attributes')[attributeId].videos.length - 1; i >= 0; i--) {
        let vidId = this.get('newModel.attributes')[attributeId].videos[i];
        let vid = this.get('newModel.videos')[vidId];

        vid.attributes.removeObject(attributeId);

        for (var j = vid.relations.length - 1; j >= 0; j--) {
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
  } while (text in obj)

  return text;
}
