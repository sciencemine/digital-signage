import AbstractList from './abstract-list';

export default AbstractList.extend({
  selectedVidPos: 0,
  keys: [],
  listItemClass: '',
  listItemSmall: '',
  listItemSelected: '',
  listItemHighlight: '',

  init() {
    this._super(...arguments);
    this.set('keys', Object.keys(this.get('videos')));
  },
  actions: {
    select(event) {
      this.get('onSelectedCallback') (this.get('videos')[this.get('selectedVidPos')]);
      event.stopPropagation();
    },
    goPrevious() {
      this.send('alterSelected', -1);
      event.stopPropagation();
    },
    cancel(event) {
      this.send('cancelCallback');
      event.stopPropagation();
    },
    goNext() {
      this.send('alterSelected', 1);
      event.stopPropagation();
    },
    videoSelected(videoPos) {
      this.get('onSelectedCallback') (this.get('videos')[videoPos]);
    },
    alterSelected(param) {
      let vidArrayLength = this.get('keys').length;
      //it was taking selectedVidPos as a string for some reason ¯\_(ツ)_/¯
      let curVidPos = parseInt(this.get('selectedVidPos')) + vidArrayLength;

      this.set('selectedVidPos', (curVidPos + (1 * param)) % vidArrayLength);
    },
    videoHovered(videoPos) {
      this.set('selectedVidPos', videoPos);
    }
  }
});
