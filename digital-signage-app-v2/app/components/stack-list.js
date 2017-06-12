/**
 * COMPONENT: stack-list
 *
 * DESCRIPTION:
 *  Stack list. Can cycle items on list 
 *
 * PARAMETERS
 *  attributeKeys - array of attribute keys
 * 
 *  selectedStackIndex - initial selected stack in list
 * 
 *  stackItemHighlight - class of stack list item when it is highlighted
 * 
 * 
 *
 * @author Zach Valenzuela & Alex Reid
 * @date 5/11/2017
 */
import Ember from 'ember';
import AbstractList from './abstract-list';

export default AbstractList.extend({
    attributeKeys: [],
    selectedStackIndex: 0,
    isMuted: true,
    isFlex: true,
    stackItemClass: '',
    stackItemHighlight: '',
    stackItemSelected: '',    
    loop: true,
    
    select: function(event) {
      this.selectedCallback(this.get('data')[this.get('selectedStackIndex')]);
      this.inputCallback();
      event.stopPropagation();    
    },
    cancel: function(event) {
      this.cancelCallback();
      this.inputCallback();
      event.stopPropagation();
    },
    goPrevious: function(event) { 
      if (parseInt(this.get('selectedStackIndex')) - 1 < 0 && !this.get('loop')) {
        this.underflowCallback();
      }
      this.changeIndex(-1);
      this.inputCallback();
      event.stopPropagation();
    },
    goNext: function(event) {
      if (parseInt(this.get('selectedStackIndex')) + 1 === this.get('attributeKeys').length && !this.get('loop')) {
        this.overflowCallback();
      }
      this.changeIndex(1);
      this.inputCallback();
      
      event.stopPropagation();
    },
    changeIndex: function(indexDelta) {
      let arrLength = this.get('attributeKeys').length;
      let curIndex = parseInt(this.get('selectedStackIndex')) + arrLength;
      this.set('selectedStackIndex', (curIndex + indexDelta) % arrLength);
    },
      
    init(){
        this._super(...arguments);
        this.set('attributeKeys', Object.keys(this.get('data')));
    },
    
    didRender() {
      this.updateFocus(this.get('focus'));
    },

    selectedStackKey: Ember.computed('attributeKeys', 'selectedStackIndex', function() {
      return this.get('attributeKeys')[this.get('selectedStackIndex')];
    }),
    actions:{
        stackClicked(videos, vidPos) {
          this.get('onClickCallback') (videos, vidPos);
        },
        stackHovered(videos, stackKey) {
          this.set('selectedStackIndex', this.get('attributeKeys').indexOf(stackKey));
          this.get('onHoverCallback') (videos, stackKey);
          this.inputCallback();
        }
    }
});
