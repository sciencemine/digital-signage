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
  
  mouseMove() {
    this.inputCallback();
  },
  select: function(event) {
    let vidPos = this.get('selectedVidPos');

    this.selectedCallback(this.get(`videos.${vidPos}`));

    event.stopPropagation();
  },
  goPrevious: function(event) {
    this.inputCallback();
    this.changeIndex(-1);

    event.stopPropagation();
  },
  cancel: function(event) {
    this.inputCallback();
    this.cancelCallback();

    event.stopPropagation();
  },
  goNext: function(event) {
    this.inputCallback();
    this.changeIndex(1);

    event.stopPropagation();
  },
  changeIndex: function(param) {
    let vidArrayLength = this.get('videos').length;
    //it was taking selectedVidPos as a string for some reason ¯\_(ツ)_/¯
    let curVidPos = parseInt(this.get('selectedVidPos')) + vidArrayLength;

    this.set('selectedVidPos', (curVidPos + param) % vidArrayLength);
  },
  didRender() {
    if (this.get('displayPopovers')) {
      if (this.$('[data-toggle="popover"]').length !== 0) {
        (function(component) {
          component.$('[data-toggle="popover"]').popover({
            trigger: 'hover focus',
            delay: {
              show: (component.get('popoverShowDelay') * 1000),
              hide: '100'
            }
          });
        }) (this);
      }
    }

    let focus = this.get('focus');
    
    if (this.$().is(':focus') !== focus) {
      this.updateFocus(focus);
    }
  },
  actions: {
    videoSelected(vidId) {
      this.selectedCallback(vidId);
    },
    videoHovered(videoPos) {
      this.set('selectedVidPos', videoPos);
       
      this.get('onHoverCallback') (videoPos);
      
      this.inputCallback();
    }
  }
});
