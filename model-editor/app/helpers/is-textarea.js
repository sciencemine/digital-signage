/*******************************************************************************
 * HELPER:
 *  is-textarea
 *
 * DESCRIPTION:
 *  Checks if an argument is a textarea.
 * 
 * PARAMETERS:
 *  arg - The argument
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

export function isTextarea([arg]) {
  return arg === "textarea";
}

export default Ember.Helper.helper(isTextarea);
