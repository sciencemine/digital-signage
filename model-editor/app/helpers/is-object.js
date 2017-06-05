/*******************************************************************************
 * HELPER:
 *  is-object
 *
 * DESCRIPTION:
 *  Checks if an argument is an object.
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

export function isObject([arg]) {
  return typeof(arg) === 'object' && !Array.isArray(arg);
}

export default Ember.Helper.helper(isObject);
