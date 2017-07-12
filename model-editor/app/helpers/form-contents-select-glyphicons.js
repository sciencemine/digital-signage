/*******************************************************************************
 * HELPER:
 *  form-contents-select
 *
 * DESCRIPTION:
 *  Creates an html5 select field
 * 
 * PARAMETERS:
 *  params - Unused
 *  hash - A hash of all named properties. Must contain the following
 *    key - The unique id to use for the select
 *    class - The css style to be applied to the select
 *    data - Array of objects to select from.
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 9th, 2017
 ******************************************************************************/
import Ember from 'ember';

export function formContentsSelectGlyphicons(params, hash) {
  let returnHTML = `<select id=${hash.key} class="${hash.class}">`;

  for (var i= 0; i < hash.data.length; i++) {
    let glyphicon = hash.data[i];
    let name = glyphicon.replace('glyphicon-', '').replace(/-/gi, ' ');

    returnHTML = returnHTML + `<option value=${glyphicon}`;

    if (hash.selected === glyphicon) {
      returnHTML = returnHTML + ` selected="selected"`;
    }
    
    returnHTML = returnHTML + `>${name}</option>`;
  }

  return Ember.String.htmlSafe(returnHTML + `</select>`);
}

export default Ember.Helper.helper(formContentsSelectGlyphicons);
