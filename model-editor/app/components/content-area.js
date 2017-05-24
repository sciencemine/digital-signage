import Ember from 'ember';

export default Ember.Component.extend({
  initialModel: null,
  newModel: null,
  selectedVideo: null,

  init() {
    this._super(...arguments);

    this.set('newModel', this.get('data.modelData'));

    this.set('selectedVideo', this.get('newModel.videos')[Object.keys(this.get('newModel.videos'))[0]]);

    if (this.get('selectedVideo')) {
      let attributeKeys = this.get('selectedVideo.attributes');
      let relations = this.get('selectedVideo.relations');

      this.set('selectedVideo.attributes', [ ]);
      this.set('selectedVideo.relations', [ ]);

      for (var attribute = 0; attribute < attributeKeys.length; attribute++) {
        let attributeData = this.get('data.modelData.attributes')[attributeKeys[attribute]];
        let data = { };

        data.name = attributeData.prettyName;
        data.description = attributeData.description;

        this.get('selectedVideo.attributes').push(data);
      }

      for (var relation = 0; relation < relations.length; relation++) {
        let data = { };
        let relatedVid = this.get('newModel.videos')[relations[relation].relatedId];

        data.name = relatedVid.prettyName;
        data.description = relatedVid.description;
        data.difficulty = relations[relation].difficulty;
        data.attribute = this.get('newModel.attributes')[relations[relation].attributeId].prettyName;

        this.get('selectedVideo.relations').push(data);
      }
    }
  }
});
