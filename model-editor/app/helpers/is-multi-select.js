/*******************************************************************************
 * HELPER:
 *  is-multi-select
 *
 * DESCRIPTION:
 *  Checks if an argument is a multi-select.
 * 
 * PARAMETERS:
 *  arg - The argument
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 9th, 2017
 ******************************************************************************/
import Ember from 'ember';


export function isMultiSelect([arg]) {
  return arg === "multi-select";
}

export default Ember.Helper.helper(isMultiSelect);
