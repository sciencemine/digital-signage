/**
 * COMPONENT: video-list
 *
 * DESCRIPTION:
 *  Video list. Can cycle items on list and callsback if there is over/under flow
 *
 * PARAMETERS
 *  videos - array of videos
 * 
 *  selectedVidPos - initial selected video in list
 * 
 *  listItemClass - class of list item
 * 
 *  listItemSmall - class of a list item when it is small
 * 
 *  listItemSelected - class of a list item when it is selected
 * 
 *  keyboard - keyboard object from model
 * 
 *  modelIdentifier - model identifier from confic
 * 
 *  focus - if the list should be focused
 * 
 *  loop - determines if the list loops to the start. default true. if false,
 *   over/under flow callbacks are required
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
  loop: true,

  init() {
    this._super(...arguments);
    this.set('keys', Object.keys(this.get('videos')));
  },
  actions: {
    select(event) {
      this.send('selectedCallback', this.get('videos')[this.get('selectedVidPos')]);
      event.stopPropagation();
    },
    goPrevious(event) {
      if (parseInt(this.get('selectedVidPos')) - 1 < 0 && !this.get('loop')) {
        this.send('underflowCallback');
      }

      this.send('alterSelected', -1);

      event.stopPropagation();
    },
    cancel(event) {
      this.send('cancelCallback');
      event.stopPropagation();
    },
    goNext(event) {
      if (parseInt(this.get('selectedVidPos')) + 1 === this.get('keys').length && !this.get('loop')) {
        this.send('overflowCallback');
      }

      this.send('alterSelected', 1);

      event.stopPropagation();
    },
    videoSelected(videoPos) {
      this.send('selectedCallback', this.get('videos')[videoPos]);
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
