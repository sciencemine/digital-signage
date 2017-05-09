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
    this.set('keys', Object.keys(this.get('videos')));
  },
  actions: {
    select(event) {
      this.send('selectedCallback', this.get('videos')[this.get('selectedVidPos')]);
      event.stopPropagation();
    },
    goPrevious() {
      this.send('incrementSelected', -1);
      event.stopPropagation();
    },
    cancel(event) {
      this.send('cancelCallback');
      event.stopPropagation();
    },
    goNext() {
      this.send('incrementSelected', 1);
      event.stopPropagation();
    },
    videoSelected(sender) {
      this.send('selectedCallback', sender);
    },
    incrementSelected(param) {
      let vidArrayLength = this.get('keys').length;
      let curVidPos = this.get('selectedVidPos') + vidArrayLength;

      this.set('selectedVidPos', (curVidPos + (1 * param)) % vidArrayLength);
    }
  }
});
