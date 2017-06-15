/*******************************************************************************
 * COMPONENT:
 *  attribute-panel
 *
 * DESCRIPTION:
 *  Attribute panel that appears on the bottom of the screen
 * 
 * PARAMETERS:
 *  attributeDropCallback - Callback for when an attribute is dropped on the 
 *    screen
 *  attributeExpandedCallback - Callback for when the attribute panel is
 *    collapsed or expanded
 *  updateModalCallback - Callback for updating the modal information
 *  deleteAttributeCallback - Callback for when an attribute is deleted
 *  data - Data from the attribute in the model
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['expanded:content-area--attribute-large:content-area--attribute-small'],
  
  /* Properties for the properties panel to know */
  expanded: true,
  prefix: "attributes",
  path: ".attributes",
  data: null,
  dragX: null,
  dragY: null,
  
  setStyle: function() {
    let header = this.$("#attribute-panel--header");
    let panel = this.$("#attribute-panel");
    let titleBottom = Ember.$("#content-area--header").height() +
                      Ember.$("#content-area--header").offset().top +
                      parseInt(Ember.$("#content-area--header").css('paddingBottom'));
                      
    header.css('bottom', Ember.$(window).height() - titleBottom);
    
    panel.css('top', (this.get('expanded') ? titleBottom : 0));
    panel.css('height', (this.get('expanded') ? Ember.$(window).height() - titleBottom : 0));
  },
  /*****************************************************************************
   * EVENT:
   *  didRender
   *
   * DESCRIPTION:
   *  When the dom renders, turns on tooltips and the scrollspy
   * 
   * AUTHOR:
   *  Michael Fryer
   *
   * DATE:
   *  June 5th, 2017
   ****************************************************************************/
  didRender() {
    if (this.$('[data-toggle="attributeTooltip"]').length !== 0) {
      this.$('[data-toggle="attributeTooltip"]').tooltip({
        trigger: 'hover focus',
        placement: 'auto',
        delay: {
          show: '250',
          hide: '100'
        }
      });
    }//if

    if (this.$('.attribute-list').length !== 0) {
      this.$('.attribute-list').scrollspy({
        target: '#attributeNav'
      });
    }//if
    
    this.setStyle();
  },
  actions: {
    dragging(event) {
      if (event.clientX !== 0 && event.clientY !== 0) {
        this.set('dragX', event.clientX);
        this.set('dragY', event.clientY);
      }//if
    },
    /***************************************************************************
     * ACTION:
     *  editAttribute
     *
     * DESCRIPTION:
     *  Callback for editing an attribute. Sends the proper data back to the
     *    container
     *
     * PARAMETERS:
     *  key - They key for which object is going to be edited
     *
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    editAttribute(key) {
      this.get('updateModalCallback') ("Edit Attribute", ".attributes.data.attribute", this.get('path'), key);
    },
    /***************************************************************************
     * ACTION:
     *  attributeDrop
     *
     * DESCRIPTION:
     *  Callback for adding an attribute to a video
     *
     * PARAMETERS:
     *  key - They key for which object is going to be edited
     *
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    attributeDrop(key) {
      this.get('attributeDropCallback') (this.get('dragX'), this.get('dragY'), key);
      this.set('dragX', null);
      this.set('dragY', null);
    },
    /***************************************************************************
     * ACTION:
     *  toggleView
     *
     * DESCRIPTION:
     *  Toggles if the attributes panel should be expanded or not.
     *
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    toggleView() {
      this.set('expanded', !this.get('expanded'));
      this.get('attributesExpandedCallback') (this.get('expanded'));
    }
  }
});
