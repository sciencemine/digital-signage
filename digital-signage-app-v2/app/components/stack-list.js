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
    //playersize: '',
    
    init(){
        this._super(...arguments);
    },
    
    didRender() {
      this.send('updateFocus', true);
    },
    actions:{
        select(event){
          this.send('selectedCallback', this.get('data')[this.get('selectedStackIndex')]);
          //this.send('input');
          event.stopPropagation();    
        },
        cancel(event){
          this.send('cancelCallback');
          //this.send('input');
          event.stopPropagation();
        },
        goPrevious(event){
          this.send('changeIndex', -1);
          //this.send('input');
          event.stopPropagation();
        },
        goNext(event){
          this.send('changeIndex', 1);
          //this.send('input');
          event.stopPropagation();
        },
        stackSelected(stackIndex){
          this.send('selectedCallback', this.get('data')[stackIndex]);
        },
        changeIndex(indexDelta){
          let arrLength = this.get('attributeKeys').length;
          let curIndex = parseInt(this.get('selectedStackIndex')) + arrLength;
          this.set('selectedStackIndex', (curIndex + indexDelta) % arrLength);
        },
        stackHovered(stackIndex){
          this.set('selectedStackIndex', stackIndex);
          //this.send('input');
        },
        input(){
          this.get('onInputCallback') ();
        }
    }
});
