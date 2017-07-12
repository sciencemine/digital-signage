/*******************************************************************************
 * HELPER:
 *  get-display-name
 *
 * DESCRIPTION:
 *  Gets display name from an object
 * 
 * PARAMETERS:
 *  arg1 - The object
 *  arg2 - A key in the object
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

export function getDisplayName([arg1, arg2]) {
  return arg1[arg2].displayName;
}

export default Ember.Helper.helper(getDisplayName);