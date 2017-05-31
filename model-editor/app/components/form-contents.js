import Ember from 'ember';

export default Ember.Component.extend({
  inputId: '',
  isInline: false,
  showList: false,
  showHelp: false,
  prefix: "",

  init() {
    this._super(...arguments);
  }
});
