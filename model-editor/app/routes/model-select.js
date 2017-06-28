import Ember from 'ember';

export default Ember.Route.extend({
  models: [],
  backgroundVideos: [],
  version: null,

  beforeModel() {
    return(function(route) {
      return Ember.$.getJSON('assets/ModelInformation.json').then((data) => {
        route.set('models', data.models);
        route.set('version', data.version);
      });
    })(this);
  },
  model() {
    let modelData = [];

    for (var i = 0; i < this.get('models').length; i++) {
      modelData.push(Ember.$.getJSON('/models/' + this.get('models')[i] + '.json'));
    }

    return Ember.RSVP.Promise.all(modelData).then((res) => {
      let data = {
        models: null,
        version: null
      };
      
      
      for (i = 0; i < this.get('models').length; i++) {
        res[i].fileName = this.get('models')[i];
        res[i].backgroundVideos = {};

        for (var j = 0; j < res[i].config.backgroundVideos.length; j++) {
          var vidKey = res[i].config.backgroundVideos[j];
          res[i].backgroundVideos[vidKey] = res[i].videos[vidKey];
        }
      }
      
      data.models = res;
      
      data.version = this.version;

      return data;
    });
  }
});
