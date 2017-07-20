import Ember from 'ember';

export default Ember.Service.extend({
  modelInformation: null,
  modelData: null,
  defaultValues: null,
  modelConfig: null,
 
  updateModel() {
    this.updateConfig();
    this.updateVideos();
    this.updateAttributes();
  },
  updateConfig() {
    this.insertKeys('.config');
  },
  updateVideos() {
    let keys = Object.keys(this.get('modelData.videos'));
    
    keys.forEach(function(key) {
      this.insertKeys(`.videos.${key}`, '.videos.default');
    }, this);
  },
  updateAttributes() {
    let keys = Object.keys(this.get('modelData.attributes'));
    
    keys.forEach(function(key) {
      this.insertKeys(`.attributes.${key}`, '.attributes.default');
    }, this);
  }, 
  insertKeys(dataPath = "", configPath = "") {
    configPath = (configPath ? configPath : dataPath);

    let modelData = this.get(`modelData${dataPath}`);
    let defaultValues = this.get(`defaultValues${configPath}`);
    let objKeys = Object.keys(modelData);

    this.set(`modelData${dataPath}`, Ember.assign(Ember.copy(defaultValues, true), modelData));

    objKeys.forEach(function(key) {
      let newData = modelData[key];
      
      if (Ember.typeOf(newData) === 'object') {
        this.insertKeys(`${dataPath}.${key}`, `${configPath}.${key}`);
      }
      else if (Ember.isArray(newData) && Ember.isPresent(newData)) {
        newData.forEach(function(arrData, arrKey) {
          if (Ember.typeOf(arrData) === 'object') {
            this.insertKeys(`${dataPath}.${key}.${arrKey}`, `${configPath}.${key}.${0}`);
          }
        }, this);
      }
    }, this);
  },
  init() {
    this._super(...arguments);
    
    this.setProperties({
      modelData: null,
      modelInformation: null,
      modelConfig: null,
      defaultValues: null
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
  loadDefaultValues(data) {
    this.set('defaultValues', data);
  
    this.updateModel();
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
  },
  removeAt(path, pos) {
    this.get(path).removeAt(pos);
    
    this.notifyPropertyChange(path.substr(0, path.indexOf('.')));
  }
});
