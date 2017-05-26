import Ember from 'ember';

export default Ember.Component.extend({
  inputId: '',
  isInline: false,
  showList: false,
  showHelp: false,

  init() {
    this._super(...arguments);
  },
  actions: {
    thing() {
      //console.log('baba');
    }
  }
});
