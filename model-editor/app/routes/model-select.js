import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Route.extend({
  modelService: service(),
  notify: service(),
  
  beforeModel() {
    return (function(route) {
      return Ember.$.getJSON('assets/ModelInformation.json').then((data) => {
        route.get('modelService').loadModelInformation(data);
        
        return (function() {
          let path = "models/ModelVersion" + data.newestVersion + ".json";
        
          return Ember.$.getJSON(path).then((modelConfig) => {
            route.get('modelService').loadModelConfig(modelConfig);
          }).fail(() => {
            route.get('notify').alert("Failed to get model configuration.", {
              radius: true,
              closeAfter: 10 * 1000
            });
          });
        }) ();
      });
    }) (this);
  },
  model() {
    let modelData = [ ];
    let modelInformation = this.get('modelService.modelInformation');
    let models = modelInformation.models;

    for (var i = 0; i < models.length; i++) {
      modelData.push(Ember.$.getJSON('/models/' + models[i] + '.json'));
    }

    return Ember.RSVP.Promise.all(modelData).then((res) => {
      let data = {
        models: null
      };
      
      data.models = res;
      data.modelInformation = modelInformation;

      return data;
    });
  }
});
