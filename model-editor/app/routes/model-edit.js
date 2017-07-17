import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Route.extend({
  modelService: service(),
  
  beforeModel() {
    let modelService = this.get('modelService');
    
    if (!modelService.get('modelData') || !modelService.get('modelConfig')) {
      this.replaceWith('modelSelect');
    }
  }
});
