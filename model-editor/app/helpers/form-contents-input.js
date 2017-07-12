/*******************************************************************************
 * HELPER:
 *  form-contents-input
 *
 * DESCRIPTION:
 *  Creates an html5 input field
 * 
 * PARAMETERS:
 *  params - Unused
 *  hash - A hash of all named properties. Must contain the following
 *    key - The unique id to use for the input
 *    class - The css style to be applied to the input
 *    placeholder - The placeholder data for the input
 *    data - with keys
 *      help - A help message
 *      inputType - The type of input to be used
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

export function formContentsInput(params, hash) {
  let returnHTML =  `<input data-toggle="tooltip" data-placement="auto top" ` +
                    `title="${hash.data.help}" type=${hash.data.inputType} ` +
                    `id=${hash.key} class="${hash.class}" ` +
                    `placeholder="${hash.placeholder}"`;

  if (hash.data.error) {
    returnHTML = returnHTML + ` oninput="setCustomValidity('');" ` +
                 `oninvalid="setCustomValidity('${hash.data.error}');"`;
  }

  if (hash.value || hash.value === 0) {
     returnHTML = returnHTML + ` value="${hash.value}"`;
  }

  for (var key in hash.data.validation) {
    let value = hash.data.validation[key];
    returnHTML = returnHTML + ` ${key}=${value}`;
  }

  return Ember.String.htmlSafe(returnHTML + ` />`);
}

export default Ember.Helper.helper(formContentsInput);
