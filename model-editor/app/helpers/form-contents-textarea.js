/*******************************************************************************
 * HELPER:
 *  form-contents-textarea
 *
 * DESCRIPTION:
 *  Creates an html5 textarea field
 * 
 * PARAMETERS:
 *  params - Unused
 *  hash - A hash of all named properties. Must contain the following
 *    key - The unique id to use for the textarea
 *    class - The css style to be applied to the textarea
 *    placeholder - The placeholder data for the textarea
 *    data - with keys
 *      help - A help message
 *      validation - Object containing html5 input validations as key, value.
 *        e.g, "max": 0
 *      error - The error message to be displayed on form invalidation.
 *        This one is optional
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

export function formContentsTextarea(params, hash) {
  let returnHTML = `<textarea data-toggle="tooltip" data-placement="auto top"` +
                   ` title="${hash.data.help}" id=${hash.key} ` +
                   `class="${hash.class}" placeholder="${hash.placeholder}"`;

  if (hash.data.error) {
    returnHTML = returnHTML + ` oninvalid="setCustomValidity('${hash.data.error}');"` +
                 ` oninput="setCustomValidity('');"`;
  } 
  
  for (var key in hash.data.validation) {
    let value = hash.data.validation[key];
    returnHTML = returnHTML + ` ${key}=${value}`;
  }

  returnHTML = returnHTML + `>`;

  if (hash.value) {
    returnHTML = returnHTML + hash.value;
  }

  return Ember.String.htmlSafe(returnHTML + `</textarea>`);
}

export default Ember.Helper.helper(formContentsTextarea);
