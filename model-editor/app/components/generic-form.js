import Ember from 'ember';

export default Ember.Component.extend({
  noLabel: true,
  isInline: false,
  showTitle: true,
  showTooltips: false,
  showHelp: false,
  showList: false,

  didRender() {
    if (this.get('showTooltips')) {
      if (this.$('[data-toggle="tooltip"]')) {
        this.$('[data-toggle="tooltip"]').tooltip({
          trigger: "focus",
          delay: {
            show: 250,
            hide: 100
          }
        });
      }
    }
  }
});
