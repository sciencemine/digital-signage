/*******************************************************************************
 * COMPONENT:
 *  properties-panel
 *
 * DESCRIPTION:
 *  Properties panel that appears on the right of the screen
 * 
 * PARAMETERS:
 *  onSubmitCallback - Callback for form submission
 *  propertiesExpandedCallback - Callback for when the properties panel is
 *    collapsed or expanded
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

export default Ember.Component.extend({
  classNameBindings: ['expanded:content-area--properties-large:content-area--properties-small'],
  
  /* Properties for the properties panel to know */
  expanded: true,
  prefix: "properties",
  path: ".videos",
  key: null,
  attributes: null,
  relations: null,

  setStyle: function() {
    let header = this.$("#properties-panel--header");
    let panel = this.$("#properties-panel");
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

    if (this.$('.panel-body').length !== 0) {
      this.$('.panel-body').scrollspy({
        target: '#propertiesNav'
      });
    }
    
    this.setStyle();
  },
  actions: {
    /***************************************************************************
     * ACTION:
     *  toggleView
     *
     * DESCRIPTION:
     *  Toggles if the properties panel should be expanded or not.
     *
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    toggleView() {
      this.set('expanded', !this.get('expanded'));
      this.get('propertiesExpandedCallback') (this.get('expanded'));
    },
    /***************************************************************************
     * ACTION:
     *  submitForm
     *
     * DESCRIPTION:
     *  Replaces the pretty attributes and relations information with the
     *    original data before sending back up to container
     *
     * PARAMETERS:
     *  data - The data that is getting sent back up
     *  path - The path for where the data is going
     *  key - The key for what is being changed
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    submitForm(data, path, key) {
      let newData = data;
      
      newData.attributes = this.get('attributes');
      newData.relations = this.get('relations');
      
      this.get('onSubmitCallback') (newData, this.get('path'), key);
    },
    /***************************************************************************
     * ACTION:
     *  doNothing
     *
     * DESCRIPTION:
     *  This does nothing. Basically a null action
     * 
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    doNothing() {
      
    }
  }
});
