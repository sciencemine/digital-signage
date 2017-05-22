import Ember from 'ember';

export default Ember.Component.extend({
  didRender() {
    if (this.$('[data-toggle="tooltip"]').length !== 0) {
      this.$('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover focus',
        placement: 'auto',
        delay: {
          show: '250',
          hide: '100'
      }});
    }

    if (this.$('.panel-body').length !== 0) {
      this.$('.panel-body').scrollspy({
        target: '.properties-navbar'
      });
    }
  }

});
