import Ember from 'ember';

export default Ember.Route.extend({
  models: [ ],

  beforeModel() {
    let route = this;

    return Ember.$.getJSON('modelList.json').then(data => {
      route.set('models', data.models);
    });
  },
  model() {
    let modelData = [];
    let models = this.get('models');
    
    models.forEach(function(model) {
      modelData.push(Ember.$.getJSON(`/models/${model}.json`));
    });

    return Ember.RSVP.Promise.all(modelData).then(res => {
      models.forEach(function(model, index) {
        res[index].fileName = model;
        res[index].backgroundVideos = [ ];
        
        res[index].config.backgroundVideos.forEach(function(bgVidId) {
          let vidObj = res[index].videos[bgVidId];
          vidObj.id = bgVidId;
          
          res[index].backgroundVideos.push(vidObj);
        });
      });

      return res;
    });
  }
});
