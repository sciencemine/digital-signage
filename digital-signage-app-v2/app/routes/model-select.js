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

    modelData = Ember.RSVP.Promise.all(modelData);

    return modelData;
  }
});
