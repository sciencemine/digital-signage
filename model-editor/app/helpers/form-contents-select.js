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
 *    help - A help message
 *    data - Array of objects to select from. If array is of objects and not
 *      primitive types, objects must have the following keys
 *      id - The value of the option
 *      data - The text to be displayed
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

export function formContentsSelect(params, hash) {
  let returnHTML = `<select data-toggle="tooltip" data-placement="auto top" ` +
                   `title="${hash.help}" id=${hash.key} class="${hash.class}">`;

  for (var i= 0; i < hash.data.length; i++) {
    let value = hash.data[i];

    if (typeof(value) === 'object' && !Array.isArray(value)) {
      returnHTML = returnHTML + `<option value=${value.id}>`;
      value = value.data;
    }
    else {
      returnHTML = returnHTML + `<option value=${value}>`;
    }

    returnHTML = returnHTML + `${value}</option>`;
  }

  return Ember.String.htmlSafe(returnHTML + `</select>`);
}

export default Ember.Helper.helper(formContentsSelect);
