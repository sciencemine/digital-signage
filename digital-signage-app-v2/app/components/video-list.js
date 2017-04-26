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
    },
    videoHovered(sender) {
      var senderUrl = sender.url;
      var isFragment = senderUrl.indexOf('#t=');

      if (isFragment !== -1) {
        senderUrl = senderUrl.substring(0, isFragment);
      }

      for (var key in this.get('videos')) {
        if (this.get(`videos[${key}].fileIdentifier`) === senderUrl) {
          this.set('selectedVidPos', key);

          break;
        }
      }
    }
  }
});
