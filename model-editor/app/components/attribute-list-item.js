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
  offsetX: null,
  offsetY: null,
  
  dragStart(event) {
    this.set('offsetX', event.offsetX + Ember.$("#" + this.elementId).offset().left);
    this.set('offsetY', event.offsetY + Ember.$("#" + this.elementId).offset().top);
  },
  /*****************************************************************************
   * EVENT:
   *  dragEnd
   *
   * DESCRIPTION:
   *  When the drag ends, send the cursor position back to the container along
   *    with the key for the attribute
   *
   * PARAMETERS:
   *  event - the drag event
   * 
   * AUTHOR:
   *  Michael Fryer
   *
   * DATE:
   *  June 5th, 2017
   ****************************************************************************/
  dragEnd(event) {
    this.get('attributeDropCallback') (event.clientX, event.clientY, this.get('key'));
  },
  actions: {
    /***************************************************************************
     * ACTION:
     *  updateModal
     *
     * DESCRIPTION:
     *  Callback for editing an attribute. Sends the key
     *
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    updateModal() {
      this.get('updateModalCallback') (this.get('key'));
    },
    /***************************************************************************
     * ACTION:
     *  deleteAttribute
     *
     * DESCRIPTION:
     *  Callback for deleting an attribute. Sends the proper data back to the
     *    container
     *
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    deleteAttribute() {
      if (confirm("Are you sure you want to delete " + this.get('data.prettyName') + "?")) {
        this.get('deleteAttributeCallback') (this.get('key'));
      }//if
    }
  }
});
