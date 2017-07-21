/*******************************************************************************
 * COMPONENT:
 *  configuration-panel
 *
 * DESCRIPTION:
 *  Configuration panel that appears on the bottom of the screen
 * 
 * PARAMETERS:
 *  onSubmitCallback - Callback for form submission
 *  configurationExpandedCallback - Callback for when the configuration panel is
 *    collapsed or expanded
 *  validationCallback - Callback for form validation
 *  class - the style to be applied to the panel
 *  data - Data from the configuration in the model
 *  config - The configuration data for generating the form
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
  modelService: service(),
  panelStates: service(),
  
  /* Properties for the configuration panel to know */
  prefix: "config",
  path: ".config",
  
  configModelData: Ember.computed('modelService.modelData', function() {
    let newData = Ember.copy(this.get('modelService.modelData'), true);
    
    if (newData) {
      let bgVids = newData.config.backgroundVideos;
      let replacementBgVids = [ ];
      
      for (var video in newData.videos) {
        let obj = {};
        
        obj.id = video;
        obj.data = newData.videos[video].prettyName;
        obj.selected = (bgVids.indexOf(video) === -1 ? false : true);
        
        replacementBgVids.push(obj);
      }
      
      newData.config.backgroundVideos = replacementBgVids;
      
      return newData.config;
    }
    else {
      return null;
    }
  }),
  styleObserver: Ember.observer('panelStates.attributesExpanded', 'panelStates.propertiesExpanded', function() {
    this.setStyle();
  }),
  setStyle: function() {
    let el = Ember.$("#" + this.elementId);
    let panelStates = this.get('panelStates');
    let propPanel = Ember.$("#properties-panel");
    let attrPanel = Ember.$("#attribute-panel");

    if (propPanel[0] && attrPanel[0]) {
      el.css('right', (panelStates.get('propertiesExpanded') ? Ember.$(window).width() - propPanel.offset().left : 0));
      el.css('left', (panelStates.get('attributesExpanded') ? attrPanel.width() : 0));
    }
  },
  didRender() {
    this.setStyle();
  },
  actions: {
    toggleView() {
      this.get('panelStates').toggleConfigExpanded();
    }
  }
});
