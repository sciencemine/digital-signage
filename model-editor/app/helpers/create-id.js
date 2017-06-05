/*******************************************************************************
 * HELPER:
 *  create-id
 *
 * DESCRIPTION:
 *  Creates an id by appending all of the input params together
 * 
 * PARAMETERS:
 *  params - Array of parameters to append
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

export function createId(params) {
  let returnId = "";

  for (var i = 0; i < params.length; i++) {
    returnId = returnId + params[i];
  }
  
  return returnId;
}

export default Ember.Helper.helper(createId);
