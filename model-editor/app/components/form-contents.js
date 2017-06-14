/*******************************************************************************
 * COMPONENT:
 *  form-contents
 *
 * DESCRIPTION:
 *  Contents of a form
 * 
 * PARAMETERS:
 *  updateModalCallback - Callback for updating modal data
 *  prefix - The prefix to use for unique ids
 *  isInline - If the form is to be inline or now
 *  showHelp - If the form is to show help messages or not
 *  showList - If the form is to show lists or not
 *  data - The data to populate the form with
 *  config - The configuration object for the form
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  isInline: false,
  showList: false,
  showHelp: false,
  prefix: "",

  init() {
    this._super(...arguments);
  },
  didUpdateAttrs() {
    if (this.get('data')) {
      this.notifyPropertyChange('data');
      this.rerender();
    }
  }
});
