import Ember from 'ember';

export default Ember.Component.extend({
  newModel: null,
  selectedVideo: null,
  selectedVideoKey: null,
  modalTitle: null,
  modalConfig: null,
  modalData: null,
  attributesExpanded: true,
  propertiesExpanded: true,

  init() {
    this._super(...arguments);

    this.set('newModel', this.get('data.modelData'));

    this.send('setSelectedVideo', Object.keys(this.get('newModel.videos'))[0]);
    this.send('replaceVideoAttributes');
    this.send('replaceVideoRelations');
  },
  didRender() {
  },
  actions: {
    updateModalInfo(title, config, path, key) {
      this.set('modalTitle', title);
      this.set('modalConfig', this.get('data.modelConfig' + config));
      this.set('modalData', (path ? this.get('newModel' + path)[key] : null));
    },
    addVideo() {
      this.send('updateModalInfo', "Add Video", '.videos.data.video');
    },
    editRelation(relationKey) {
      this.set('modalTitle', "Edit Relation");
      this.set('modalConfig', this.get('data.modelConfig.videos.data.video.data.relations.data.relation'));
      this.set('modalData', this.get('newModel.videos')[this.get('selectedVideoKey')].relations[relationKey]);
    },
    addAttribute() {
      this.send('updateModalInfo', "Add Attribute", ".attributes.data.attribute");
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
    },
    replaceVideoAttributes() {
      let attributes = this.get('selectedVideo.attributes');

      this.set('selectedVideo.attributes', [ ]);

      for (var attribute = 0; attribute < attributes.length; attribute++) {
        let attributeData = this.get('data.modelData.attributes')[attributes[attribute]];
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
    modalSubmit(data) {
      //console.log(data);
    }
  }
});
