import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    return(function(route) {
      return Ember.$.getJSON('assets/ModelInformation.json').then((data) => {
        route.set('modelInformation', data);
      });
    }) (this);
  },
  model() {
    let modelData = [];
    let modelInformation = this.get('modelInformation');
    let models = modelInformation.models;

    for (var i = 0; i < models.length; i++) {
      modelData.push(Ember.$.getJSON('/models/' + models[i] + '.json'));
    }

    return Ember.RSVP.Promise.all(modelData).then((res) => {
      let data = {
        models: null
      };
      
      
      for (i = 0; i < models.length; i++) {
        res[i].fileName = models[i];
        res[i].backgroundVideos = {};

        for (var j = 0; j < res[i].config.backgroundVideos.length; j++) {
          var vidKey = res[i].config.backgroundVideos[j];
          res[i].backgroundVideos[vidKey] = res[i].videos[vidKey];
        }
      }
      
      data.models = res;
      data.modelInformation = modelInformation;

      return data;
    });
  }
});
