import Ember from 'ember';

export default Ember.Component.extend({
  initialModel: null,
  newModel: null,
  selectedVideo: { },

  init() {
    let component = this;
    this._super(...arguments);

    this.set('newModel', this.get('data.modelData'));

    for (var vid in this.get('data.modelData.videos')) {
      this.set('selectedVideo', this.get('data.modelData.videos')[0]);

      break;
    }
  }
});
