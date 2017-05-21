import Ember from 'ember';

export default Ember.Component.extend({
  didRender() {
    this.$('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover',
      placement: 'auto',
      delay: {
        show: '250',
        hide: '100'
      }});

    this.$('#attribute-list').scrollspy({ target: '.attribute-navbar'});
  }
});
