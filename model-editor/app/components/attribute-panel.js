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

const { inject: { service } } = Ember;

export default Ember.Component.extend({
  panelStates: service(),
  modelService: service(),
  
  classNameBindings: ['expanded:content-area--attribute-large:content-area--attribute-small'],
  
  /* Properties for the properties panel to know */
  prefix: "attributes",
  path: ".attributes",
  dragX: null,
  dragY: null,
  
  setStyle: function() {
    let pageHeader = Ember.$("#content-area--header");
    
    if (pageHeader[0]) {
      let header = this.$("#attribute-panel--header");
      let panel = this.$("#attribute-panel");
      let titleBottom = pageHeader.height() +
                        pageHeader.offset().top +
                        parseInt(pageHeader.css('paddingBottom'));
                        
      header.css('bottom', Ember.$(window).height() - titleBottom);
      
      let expanded = this.get('panelStates.attributesExpanded');
      
      panel.css('top', (expanded ? titleBottom : 0));
      panel.css('height', (expanded ? Ember.$(window).height() - titleBottom : 0));
    }
  },
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
    }
    
    this.setStyle();
  },
  actions: {
    dragging(event) {
      if (event.clientX !== 0 && event.clientY !== 0) {
        this.setProperties({
          dragX: event.clientX,
          dragY: event.clientY
        });
      }
    },
    editAttribute(key) {
      this.get('updateModalCallback') ("Edit Attribute", ".attributes.data.attribute", this.get('path'), key);
    },
    attributeDrop(key) {
      this.get('attributeDropCallback') (this.get('dragX'), this.get('dragY'), key);

      this.setProperties({
        dragX: null,
        dragY: null
      });
    },
    toggleView() {
      this.get('panelStates').toggleAttributesExpanded();
    },
    scrollDiv(elId) {
      let container = this.$("#attribute-panel");
      let targetEl = this.$(elId);
      let titleBottom = Ember.$("#content-area--header").height() +
                      Ember.$("#content-area--header").offset().top +
                      parseInt(Ember.$("#content-area--header").css('paddingBottom'));
      
      container.scrollTop(targetEl.offset().top - titleBottom);
    }
  }
});
