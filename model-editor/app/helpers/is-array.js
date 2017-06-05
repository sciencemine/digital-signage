/*******************************************************************************
 * HELPER:
 *  is-array
 *
 * DESCRIPTION:
 *  Checks if an argument is an array.
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

export function isArray([arg]) {
  return Array.isArray(arg);
}

export default Ember.Helper.helper(isArray);
