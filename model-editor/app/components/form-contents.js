import Ember from 'ember';

export default Ember.Component.extend({
  offset: -1,
  formOffset: '',
  nextFormOffset: '',

  init() {
    this._super(...arguments);
    this.set('formOffset', 'col-sm-offset-' + (this.get('offset') + 1));
    this.set('offset', (this.get('offset') + 1));
    this.set('nextFormOffset', 'col-sm-offset-' + (this.get('offset') + 1));
  }
});
