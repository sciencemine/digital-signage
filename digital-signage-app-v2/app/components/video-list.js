/**
 * COMPONENT: video-list
 *
 * DESCRIPTION:
 *  Video list. Can cycle items on list and callsback if there is over/under flow
 *
 * CALLBACKS
 *  onSelectedCallback
 *    Callback for when an item has been selected
 *
 *  onCancelledCallback
 *    Callback for when the cancel action is invoked
 *
 *  onOverflowCallback
 *    Callback for when the list is incremented past the last element
 *
 *  onUnderflowCallback
 *    Callback for when the list is decremented past the first element
 *
 * @author Michael Fryer
 * @date 5/11/2017
 */
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
      this.get('selectedCallback') (this.get('videos')[this.get('selectedVidPos')]);
      event.stopPropagation();
    },
    goPrevious(event) {
      this.send('alterSelected', -1);
      event.stopPropagation();
    },
    cancel(event) {
      this.send('cancelCallback');
      event.stopPropagation();
    },
    goNext(event) {
      this.send('alterSelected', 1);
      event.stopPropagation();
    },
    videoSelected(videoPos) {
      this.get('selectedCallback') (this.get('videos')[videoPos]);
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
