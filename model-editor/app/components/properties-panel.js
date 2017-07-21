/*******************************************************************************
 * COMPONENT:
 *  properties-panel
 *
 * DESCRIPTION:
 *  Properties panel that appears on the right of the screen
 * 
 * PARAMETERS:
 *  onSubmitCallback - Callback for form submission
 *  updateModalCallback - Callback for updating the modal information
 *  data - The selected video
 *  attributes - The original attributes from the video
 *  relations - The original relation from the video
 *  config - The configuration data for generating the form
 *  vidKey - The key of the currently selected video
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
  
  classNameBindings: ['expanded:content-area--properties-large:content-area--properties-small'],
  
  /* Properties for the properties panel to know */
  prefix: "properties",
  path: ".videos",
  key: null,
  attributes: null,
  relations: null,

  setStyle: function() {
    let pageHeader = Ember.$("#content-area--header");
    
    if (pageHeader[0]) {
      let header = this.$("#properties-panel--header");
      let panel = this.$("#properties-panel");
      let titleBottom = pageHeader.height() +
                        pageHeader.offset().top +
                        parseInt(pageHeader.css('paddingBottom'));
                        
      header.css('bottom', Ember.$(window).height() - titleBottom);
      
      let expanded = this.get('panelStates.propertiesExpanded');
      
      panel.css('top', (expanded ? titleBottom : 0));
      panel.css('height', (expanded ? Ember.$(window).height() - titleBottom : 0));
    }
  },
  didRender() {
    if (this.$('[data-toggle="propertiesTooltip"]').length !== 0) {
      this.$('[data-toggle="propertiesTooltip"]').tooltip({
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
    toggleView() {
      this.get('panelStates').togglePropertiesExpanded();
    },
    submitForm(data, path, key) {
      let newData = data;
      
      newData.attributes = this.get('attributes');
      newData.relations = this.get('relations');
      
      this.get('onSubmitCallback') (newData, this.get('path'), key);
    },
    doNothing() {
      
    },
    scrollDiv(elId) {
      let pageHeader = Ember.$("#content-area--header");
      
      if (pageHeader[0]) {
        let container = this.$("#properties-panel");
        let targetEl = this.$(elId);
        let titleBottom = Ember.$("#content-area--header").height() +
                        Ember.$("#content-area--header").offset().top +
                        parseInt(Ember.$("#content-area--header").css('paddingBottom'));
        
        container.scrollTop(targetEl.offset().top - titleBottom);
      }
    }
  }
});
