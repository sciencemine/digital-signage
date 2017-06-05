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
      
    init(){
        this._super(...arguments);
        this.set('attributeKeys', Object.keys(this.get('data')));
    },
    
    didRender() {
      this.send('updateFocus', true);
    },

    selectedStackKey: Ember.computed('attributeKeys', 'selectedStackIndex', function() {
      //console.log('any string');
      return this.get('attributeKeys')[this.get('selectedStackIndex')];
    }),
    actions:{
        select(event){
          this.send('selectedCallback', this.get('data')[this.get('selectedStackIndex')]);
          this.send('input');
          event.stopPropagation();    
        },
        cancel(event){
          this.send('cancelCallback');
          this.send('input');
          event.stopPropagation();
        },
        goPrevious(event){
          if (parseInt(this.get('selectedStackIndex')) - 1 < 0 && !this.get('loop')) {
            this.send('underflowCallback');
          }
          this.send('changeIndex', -1);
          this.send('input');
          event.stopPropagation();
        },
        goNext(event){
          if (parseInt(this.get('selectedStackIndex')) + 1 === this.get('attributeKeys').length && !this.get('loop')) {
            this.send('overflowCallback');
          }
          this.send('changeIndex', 1);
          this.send('input');
          //console.log(this.get('selectedStackKey'), this.get('selectedStackIndex'));
          event.stopPropagation();
        },
        stackClicked(videos, vidPos){
          this.get('onClickCallback') (videos, vidPos);
        },
        changeIndex(indexDelta){
          let arrLength = this.get('attributeKeys').length;
          let curIndex = parseInt(this.get('selectedStackIndex')) + arrLength;
          this.set('selectedStackIndex', (curIndex + indexDelta) % arrLength);
        },
        stackHovered(videos, stackKey){
          this.set('selectedStackIndex', this.get('attributeKeys').indexOf(stackKey));
          this.get('onHoverCallback') (videos, stackKey);
          this.send('input');
        },
        input()
        {}
    }
});
