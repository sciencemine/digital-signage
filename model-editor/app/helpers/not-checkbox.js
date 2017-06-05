/*******************************************************************************
 * HELPER:
 *  not-checkbox
 *
 * DESCRIPTION:
 *  Checks if an argument is not checkbox
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

export function notCheckbox([arg]) {
  return arg !== 'checkbox';
}

export default Ember.Helper.helper(notCheckbox);
