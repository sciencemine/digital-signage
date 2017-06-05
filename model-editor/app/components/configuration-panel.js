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
