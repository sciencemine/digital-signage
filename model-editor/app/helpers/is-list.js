/*******************************************************************************
 * HELPER:
 *  is-list
 *
 * DESCRIPTION:
 *  Checks if an argument is a list.
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

export function isList([arg1]) {
  return arg1 === 'list';
}

export default Ember.Helper.helper(isList);
