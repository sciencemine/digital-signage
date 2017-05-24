import Ember from 'ember';

export default Ember.Route.extend({
  models: [],

  beforeModel() {
    let route = this;

    return Ember.$.getJSON('modelList.json').then(data => {
      route.set('models', data.models);
    });
  },
  model() {
    let modelData = [];

    for (var i = 0; i < this.get('models').length; i++) {
      modelData.push(Ember.$.getJSON('/models/' + this.get('models')[i] + '.json'));
    }

    return Ember.RSVP.Promise.all(modelData).then(res => {
      for (i = 0; i < this.get('models').length; i++) {
        res[i].fileName = this.get('models')[i];
        res[i].backgroundVideos = [];

        for (var j = 0; j < res[i].config.backgroundVideos.length; j++) {
          var vidKey = res[i].config.backgroundVideos[j];
          res[i].backgroundVideos.push(res[i].videos[vidKey]);
        }
      }

      return res;
    });
  }
});
