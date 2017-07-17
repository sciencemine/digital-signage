import Ember from 'ember';

export default Ember.Service.extend({
  modelInformation: null,
  modelData: null,
  modelConfig: null,
  
  init() {
    this._super(...arguments);
    
    this.setProperties({
      modelData: null,
      modelInformation: null,
      modelConfig: null
    });
  },
  loadModelData(data) {
    this.set('modelData', data);
  },
  loadModelInformation(data) {
    this.set('modelInformation', data);
  },
  loadModelConfig(data) {
    this.set('modelConfig', data);
  },
  update(path, data) {
    let destData = this.get(path);
    
    if (Ember.isArray(destData) && !Ember.isArray(data)) {
      destData.pushObject(data);
    }
    else {
      this.set(path, data);
    }
    
    this.notifyPropertyChange(path.substr(0, path.indexOf('.')));
  },
  remove(path, data) {    
    this.get(path).removeObject(data);
    
    this.notifyPropertyChange(path.substr(0, path.indexOf('.')));
  }
});
