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

  dataObserver: Ember.observer('data', function () {
      
    this.send('replaceBackgroundVideos');
  }),
  init() {
    this._super(...arguments);
    
    this.send('replaceBackgroundVideos');
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
    },
    replaceBackgroundVideos() {
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
    }
  }
});
