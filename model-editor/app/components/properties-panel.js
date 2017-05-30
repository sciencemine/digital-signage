import Ember from 'ember';

export default Ember.Component.extend({
  expanded: true,
  prefix: "properties",

  didRender() {
    if (this.$('[data-toggle="propertiesTooltip"]').length !== 0) {
      this.$('[data-toggle="propertiesTooltip"]').tooltip({
        trigger: 'hover focus',
        placement: 'auto',
        delay: {
          show: '250',
          hide: '100'
        }
      });
    }

    if (this.$('#panel-body').length !== 0) {
      this.$('#panel-body').scrollspy({
        target: '#propertiesNav'
      });
    }
  },
  actions: {
    toggleView() {
      this.set('expanded', !this.get('expanded'));
      this.get('propertiesExpandedCallback') (this.get('expanded'));
    },
    doNothing() {
      
    }
  }
});
