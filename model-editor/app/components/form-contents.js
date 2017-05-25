import Ember from 'ember';

export default Ember.Component.extend({
  inputId: '',
  showList: false,
  showHelp: false,

  init() {
    this._super(...arguments);
  }
});
