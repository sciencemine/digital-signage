/*******************************************************************************
 * HELPER:
 *  textarea-css
 *
 * DESCRIPTION:
 *  Creates the css for a text area
 * 
 * PARAMETERS:
 *  arg - If text area is in a horizontal form or inline form
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

export function textareaCss([arg]) {
  let css = "form-control input-sm";

  if (arg === true) {
    css = css + " resize-horizontal";
  }
  else {
    css = css + " resize-vertical";
  }

  return css;
}

export default Ember.Helper.helper(textareaCss);
