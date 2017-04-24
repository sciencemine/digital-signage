import AbstractList from './abstract-list';

export default AbstractList.extend({
  selectedVidPos: -1,
  keys: [],
  listItemClass: '',
  listItemLarge: '',
  listItemSmall: '',
  listItemHighlight: '',

  init() {
    this._super(...arguments);
    this.set('keys', Object.keys(this.get('data')));
  },
  actions: {
    select(event) {
      this.send('selectedCallback', this.get('data')[this.get('selectedVidPos')]);
      event.stopPropagation();
    },
    goPrevious() {
      let vidArrayLength = this.get('keys').length;
      let curVidPos = this.get('selectedVidPos') + vidArrayLength;

      this.set('selectedVidPos', (curVidPos - 1) % vidArrayLength);
      event.stopPropagation();
    },
    cancel(event) {
      this.send('cancelCallback');
      event.stopPropagation();
    },
    goNext() {
      let vidArrayLength = this.get('keys').length;
      let curVidPos = this.get('selectedVidPos') + vidArrayLength;

      this.set('selectedVidPos', (curVidPos + 1) % vidArrayLength);
      event.stopPropagation();
    },
    videoSelected(sender) {
      this.send('selectedCallback', sender);
    }
  }
});
