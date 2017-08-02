import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Route.extend({
  modelService: service(),
  visData: service(),
  notify: service(),
  
  beforeModel() {
    let modelService = this.get('modelService');
    
    if (!modelService.get('modelData') || !modelService.get('modelConfig')) {
      this.replaceWith('modelSelect');
    }
    else {
      this.get('visData').clear();
    }
    
    let path = `models/ModelDefaults${modelService.get('modelInformation.newestVersion')}.json`;
    
    return (function(route) {
      return Ember.$.getJSON(path).then((data) => {
        modelService.loadDefaultValues(data);
      }).fail(() => {
        route.get('notify').warning("Could not pull data to update model. Using old version.", {
          radius: true,
          closeAfter: 10 * 1000
        });
      });
    }) (this);
  }
});
