import Ember from 'ember';

export default Ember.Component.extend({
  filterType: "All",
  displayVideos: {},

  init() {
    this._super(...arguments);
    this.set('displayVideos', this.get('videos'));
  },

  actions: {
    setMenuVideos(newAttributeID) {
      if (newAttributeID === -1) {
        this.set('displayVideos', this.get('videos'));
      }
      else {
        let tempVideos = {};

        let attributes = this.get('attributes.' + newAttributeID + '.videos');

        for (var videoID = 0; videoID < attributes.length; videoID++) {
          tempVideos[videoID] = this.get('videos')[attributes[videoID]];
        }

        this.set('displayVideos', tempVideos);
      }
    },
    baba() {
      
    }
  }
});
