/*******************************************************************************
 * HELPER:
 *  is-checkbox
 *
 * DESCRIPTION:
 *  Checks if an argument is a checkbox
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

export function isCheckbox([arg]) {
  return arg === 'checkbox';
}

export default Ember.Helper.helper(isCheckbox);
