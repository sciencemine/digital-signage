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
 *  modelIdentifier - model identifier from config
 * 
 *  focus - if the list should be focused
 *
 * @author Michael Fryer
 * @date 5/11/2017
 */
import AbstractList from './abstract-list';

export default AbstractList.extend({
  selectedVidPos: 0,
  listItemClass: '',
  listItemSmall: '',
  listItemSelected: '',
  listItemHighlight: '',
  displayPopovers: false,
  popoverShowDelay: 0.25,
  muted: false,
  
  select: function(event) {
    this.selectedCallback(this.get('videos')[this.get('selectedVidPos')], this.get('selectedVidPos'));

    this.inputCallback();

    event.stopPropagation();
  },
  goPrevious: function(event) {
    this.changeIndex(-1);
    this.inputCallback();

    event.stopPropagation();
  },
  cancel: function(event) {
    this.cancelCallback();

    this.inputCallback();

    event.stopPropagation();
  },
  goNext: function(event) {
    this.changeIndex(1);
    this.inputCallback();

    event.stopPropagation();
  },
  changeIndex: function(param) {
    let vidArrayLength = this.get('videos').length;
    //it was taking selectedVidPos as a string for some reason ¯\_(ツ)_/¯
    let curVidPos = parseInt(this.get('selectedVidPos')) + vidArrayLength;

    this.set('selectedVidPos', (curVidPos + param) % vidArrayLength);
  },
  
  init() {
    this._super(...arguments);
  },
  actions: {
    videoSelected(videoPos) {
      this.selectedCallback(this.get('videos')[videoPos], videoPos);
    },
    videoHovered(videoPos) {
      this.set('selectedVidPos', videoPos);
      
      this.get('onHoverCallback') (videoPos);

      this.inputCallback();
    }
  }
});
