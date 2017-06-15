import Ember from 'ember';

export default Ember.Component.extend({
  videoListData: null,
  stackListFocus: true,

  init() {
    this._super(...arguments);

    this.set('videoListData', this.get('data')['history'].videos);
  },
  didRender() {

  },
  actions: {
    /* Stack List Controller */
    stackListHover(videos, vidPos) {
      this.set('videoListData', videos);
    },
    stackListCancelled() {
      console.log('Stack list canceled');
    },
    stackListSelected(videos, vidPos) {
      this.set('videoListData', videos);
    },
    stackListInput() {
      this.get('onInputCallback');
    },
    stackListOverflow() {
      this.set('stackListFocus', false);
    },
    stackListUnderflow() {
      this.set('stackListFocus', false);
    },
    /* Video List Controller */
    videoListCancelled() {
      this.set('stackListFocus', true);
    },
    videoListSelected(sender, selected, selectedPos) {
      this.get('videoSelectedCallback') (sender, selected);
    },
    videoListInput() {
      this.get('onInputCallback');
    },
    videoListOverflow() {
      this.set('stackListFocus', true);
    },
    videoListUnderflow() {
      this.set('stackListFocus', true);
    }
  }
});
