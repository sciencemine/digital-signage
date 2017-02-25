import Ember from 'ember';

export default Ember.Component.extend({
  isActive: null,

  init() {
    this._super(...arguments);
    this.set('isActive', this.get('startActive'));
  }
});
