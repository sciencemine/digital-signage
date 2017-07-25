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
 *  data - array of attributes and video keys replaced with objects as follows:
 *  {
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
import AbstractList from './abstract-list';

export default AbstractList.extend({
  selectedStackIndex: 0,
  isMuted: true,
  isFlex: true,
  stackItemClass: '',
  stackItemHighlight: '',
  
  mouseMove() {
    this.inputCallback();
  },
  select: function(event) {
    let stackIndex = this.get('selectedStackIndex');
    
    this.selectedCallback(stackIndex);
    
    event.stopPropagation();  
  },
  goPrevious: function(event) {
    this.inputCallback();
    this.changeIndex(-1);
    
    let stackIndex = this.get('selectedStackIndex');

    this.get('onStackChangeCallback') (stackIndex);
    
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
    
    let stackIndex = this.get('selectedStackIndex');

    this.get('onStackChangeCallback') (stackIndex);
    
    event.stopPropagation();
  },
  changeIndex: function(indexDelta) {
    let arrLength = this.get('data').length;
    let curIndex = parseInt(this.get('selectedStackIndex')) + arrLength;
    
    this.set('selectedStackIndex', (curIndex + indexDelta) % arrLength);
  },
  init() {
    this._super(...arguments);
  },
  actions: {
    stackSelected(videos, vidPos) {
      this.selectedCallback(videos, vidPos);
    },
    stackHovered(videos, stackKey) {
      this.set('selectedStackIndex', stackKey);
      
      this.get('onHoverCallback') (videos, stackKey);
      
      this.inputCallback();
      
    }
  }
});
