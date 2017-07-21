import Ember from 'ember';

export default Ember.Service.extend({
  propertiesExpanded: true,
  configExpanded: true,
  attributesExpanded: true,
  
  init() {
    this._super(...arguments);
    
    this.setProperties({
      propertiesExpanded: true,
      configExpanded: true,
      attributesExpanded: true
    });
  },
  togglePropertiesExpanded() {
    this.toggleProperty('propertiesExpanded');
  },
  toggleConfigExpanded() {
    this.toggleProperty('configExpanded');
  },
  toggleAttributesExpanded() {
    this.toggleProperty('attributesExpanded');
  }
});
