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
 *  loop - determines if the list loops to the start. default true. if false,
 *   over/under flow callbacks are required
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
  loop: true,
  popoverShowDelay: 0.25,
  muted: false,
  
  select: function(event) {
    this.selectedCallback(this.get('videos')[this.get('selectedVidPos')], this.get('selectedVidPos'));

    this.inputCallback();

    event.stopPropagation();
  },
  goPrevious: function(event) {
    if (parseInt(this.get('selectedVidPos')) - 1 < 0 && !this.get('loop')) {
      this.underflowCallback();
      return;
    }
    else{
      this.alterSelected(-1);
    }

    this.inputCallback();

    event.stopPropagation();
  },
  cancel: function(event) {
    this.cancelCallback();

    this.inputCallback();

    event.stopPropagation();
  },
  goNext: function(event) {
    if (parseInt(this.get('selectedVidPos')) + 1 === this.get('videos').length && !this.get('loop')) {
      this.overflowCallback();
      return;
    }
    else{
      this.alterSelected(1);
    }
    this.inputCallback();

    event.stopPropagation();
  },
  alterSelected: function(param) {
    let vidArrayLength = this.get('videos').length;
    //it was taking selectedVidPos as a string for some reason ¯\_(ツ)_/¯
    let curVidPos = parseInt(this.get('selectedVidPos')) + vidArrayLength;

    this.set('selectedVidPos', (curVidPos + param) % vidArrayLength);
  },

  init() {
    this._super(...arguments);
  },
  didRender() {
    if (this.get('displayPopovers')) {
      let component = this;
      
      if (this.$('[data-toggle="popover"]').length !== 0){
        component.$('[data-toggle="popover"]').popover({
          trigger: 'hover focus',
          delay: {
            show: (component.get('popoverShowDelay') * 1000),
            hide: '100'
          }
        });	
      }
    }

    this.updateFocus(this.get('focus'));
  },
  actions: {
    videoSelected(videoPos) {
      this.selectedCallback(this.get('videos')[videoPos], videoPos);
    },
    videoHovered(videoPos) {
      this.set('selectedVidPos', videoPos);

      this.inputCallback();
    }
  }
});
