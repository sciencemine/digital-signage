/*******************************************************************************
 * HELPER:
 *  is-valid-input-type
 *
 * DESCRIPTION:
 *  Checks if an argument is a valid input type
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

export function isValidInputType([arg1]) {
  return arg1 === 'text' || arg1 === 'dropdown' || arg1 === 'number' || arg1 === 'checkbox';
}

export default Ember.Helper.helper(isValidInputType);
