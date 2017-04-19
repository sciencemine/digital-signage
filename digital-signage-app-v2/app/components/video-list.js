import AbstractList from './abstract-list';

export default AbstractList.extend({
  selectedVidPos: 0,

  init() {
    this._super(...arguments);
  },
  actions: {
    select(event) {
      this.send('selectedCallback', this.get('data')[this.get('selectedVidPos')]);
      event.stopPropagation();
    },
    goNext() {
      let curVidPos = this.get('selectedVidPos');

      if (curVidPos === this.get('data').length - 1) {
        this.set('selectedVidPos', 0);
      }
      else {
        this.set('selectedVidPos', curVidPos + 1);
      }
    },
    goPrevious() {
      let curVidPos = this.get('selectedVidPos');

      if (curVidPos === 0) {
        this.set('selectedVidPos', this.get('data').length - 1);
      }
      else {
        this.set('selectedVidPos', curVidPos - 1);
      }
    },
    videoSelected(sender) {
      this.send('selectedCallback', sender);
    }
  }
});
