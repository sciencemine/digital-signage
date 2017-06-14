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

export default Ember.Component.extend({
  /* Properties for the configuration panel to know */
  expanded: true,
  prefix: "config",
  path: ".config",
  configModelData: null,
  
  replaceBackgroundVideos: function() {
    let newData = Ember.copy(this.get('data'));
    let bgVids = newData.config.backgroundVideos;
    let replacementBgVids = [];
    
    for (var video in newData.videos) {
      let obj = {};
      
      obj.id = video;
      obj.data = newData.videos[video].prettyName;
      obj.selected = (bgVids.indexOf(video) === -1 ? false : true);
      
      replacementBgVids.push(obj);
    }//for
    
    newData.config.backgroundVideos = replacementBgVids;
    this.set('configModelData', newData.config);
  },
  setStyle: function() {
    let el = Ember.$("#" + this.elementId);
    
    el.css('right', (this.get('propertiesExpanded') ? Ember.$("#properties-panel").width() : 0));
    el.css('left', (this.get('attributesExpanded') ? Ember.$("#attribute-panel").width() : 0));
  },
  expandedObserver: Ember.observer('attributesExpanded', 'propertiesExpanded', function() {
    this.setStyle();
  }),
  init() {
    this._super(...arguments);
    
    this.replaceBackgroundVideos();
  },
  didRender() {
    this.setStyle();
  },
  didUpdateAttrs() {
    this.replaceBackgroundVideos();
  },
  actions: {
    /***************************************************************************
     * ACTION:
     *  toggleView
     *
     * DESCRIPTION:
     *  Toggles if the configuration panel should be expanded or not.
     *
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    toggleView() {
      this.set('expanded', !this.get('expanded'));

      this.get('configurationExpandedCallback') (this.get('expanded'));
    }
  }
});
