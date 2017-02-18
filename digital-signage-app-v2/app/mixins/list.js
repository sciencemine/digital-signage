import Ember from 'ember';

export default Ember.Mixin.create({
  isActive: false,

  init() {
    this.set('isActive', this.get('startActive'));
  },
  setIsActive(isActive) {
    this.set('isActive', isActive);
  },
  getIsActive() {
    return this.get('isActive');
  }
});
