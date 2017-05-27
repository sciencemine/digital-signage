import Ember from 'ember';

export function createId(params) {
  let returnId = "";

  for (var i = 0; i < params.length; i++) {
    returnId = returnId + params[i];
  }
  
  return returnId;
}

export default Ember.Helper.helper(createId);
