import AbstractList from './abstract-list';

export default AbstractList.extend({
  init() {
    this._super(...arguments);
  },

  actions: {
    videoSelected(sender) {
      this.send('selectedCallback', sender);
    }
  }
});
