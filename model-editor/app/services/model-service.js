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
    
    this.set('modelData.config.version', this.get('modelInformation.newestVersion'));
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
  saveModel() {
    let replacer = function(key, value) { // jshint ignore:line
      if (Ember.typeOf(value) === 'string') {
        return value.replace(/(“)|(”)/gi, '\"').replace(/(‘)|(’)/gi, '\'');
      }
      
      return value;
    };

    let modelData = this.get('modelData');
    let prettyName = modelData.config.prettyName;
    let download = confirm(`Do you want to download the exhibit model for ${prettyName}? (Cancel for no).`);
    
    if (download) {
      let a = document.createElement('a');

      a.setAttribute('href', 'data:text/plain;charset=utf-u,' +
                     encodeURIComponent(JSON.stringify(modelData, replacer, '\t')));

      a.setAttribute('download', prettyName.replace(/\s/gi, '') + ".json");

      a.click();
    }
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
