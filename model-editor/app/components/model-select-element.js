/*******************************************************************************
 * COMPONENT:
 *  model-select-element
 *
 * DESCRIPTION:
 *  An element on the model selection screen
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: [ "list-group-item", "model-select--element", "unselectable" ],
  
  showUpdate: true,
  name: '',
  description: '',
  
  actions: {
    selectExhibit() {
      this.get('onSelectCallback') ();
    },
    updateExhibit() {
      this.get('onUpdateCallback') ();
    }
  }
});
