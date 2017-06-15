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
 *  data - object with keys of attributes and video keys replaced with objects as follows:
 *  "": {
 *    "prettyName": "",
 *    "description": "",
 *    "x": 0,
 *    "y": 0,
 *    "videos": [
 *      {
 *        "prettyName": "",
 *        "description": "",
 *        "attributes": [ ],
 *        "relations": [
 *          {
 *            "relatedId": "",
 *            "difficulty": 1,
 *            "attributeId": ""
 *          }
 *        ],
 *        "full": {
 *          "fileIdentifier": "",
 *          "isUrl": false,
 *          "attribution": ""
 *        },
 *        "teaser": {
 *          "fileIdentifier": "",
 *          "isUrl": false,
 *          "attribution": ""
 *        }
 *      }
 *    ]
 *  }
 *
 * @author Zach Valenzuela & Alex Reid
 * @date 5/11/2017
 */
import Ember from 'ember';
import AbstractList from './abstract-list';

export default AbstractList.extend({
    selectedStackIndex: 0,
    isMuted: true,
    isFlex: true,
    stackItemClass: '',
    stackItemHighlight: '',
    stackItemSelected: '',    
    loop: true,
    
    select: function(event) {
      this.selectedCallback(this.get('data')[this.get('selectedStackIndex')], this.get('selectedStackIndex'));
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

        return;
      }
      else {
        this.changeIndex(-1);
      }
      
      this.inputCallback();
      event.stopPropagation();
    },
    goNext: function(event) {
      if (parseInt(this.get('selectedStackIndex')) + 1 === this.get('data').length && !this.get('loop')) {
        this.overflowCallback();

        return;
      }
      else {
        this.changeIndex(1);
      }

      this.inputCallback();
      
      event.stopPropagation();
    },
    changeIndex: function(indexDelta) {
      let arrLength = this.get('data').length;
      let curIndex = parseInt(this.get('selectedStackIndex')) + arrLength;
      this.set('selectedStackIndex', (curIndex + indexDelta) % arrLength);
    },
      
    init(){console.log(this.get('data'))
        this._super(...arguments);
    },
    
    didRender() {
      this.updateFocus(this.get('focus'));
    },

    selectedStackKey: Ember.computed('data', 'selectedStackIndex', function() {
      return this.get('data')[this.get('selectedStackIndex')];
    }),
    actions:{
        stackClicked(videos, vidPos) {
          this.selectedCallback(videos, vidPos);
        },
        stackHovered(videos, stackKey) {
          this.set('selectedStackIndex', this.get('data').indexOf(stackKey));
          this.get('onHoverCallback') (videos, stackKey);
          this.inputCallback();
        }
    }
});
