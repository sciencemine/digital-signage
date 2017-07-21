/*******************************************************************************
 * COMPONENT:
 *  attribute-list-item
 *
 * DESCRIPTION:
 *  An item in the attribute list
 * 
 * PARAMETERS:
 *  attributeDropCallback - Callback for when an attribute is dropped on the 
 *    screen
 *  deleteAttributeCallback - Callback for when an attribute is deleted
 *  updateModalCallback - Callback for updating the modal information
 *  id - The unique dom id for the element
 *  key - They key for the attribute in the model
 *  data - Data for an attribute
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

export default Ember.Component.extend({
  dragX: null,
  dragY: null,

  drag(event) {
    if (event.clientX !== 0 && event.clientY !== 0) {
      this.setProperties({
        dragX: event.clientX,
        dragY: event.clientY
      });
    }
  },
  dragEnd() {
    this.get('attributeDropCallback') (this.get('dragX'), this.get('dragY'), this.get('key'));

    this.setProperties({
      dragX: null,
      dragY: null
    });
  },
  actions: {
    updateModal() {
      this.get('updateModalCallback') (this.get('key'));
    },
    deleteAttribute() {
      if (confirm("Are you sure you want to delete " + this.get('data.prettyName') + "?")) {
        this.get('deleteAttributeCallback') (this.get('key'));
      }
    }
  }
});
