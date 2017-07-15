import Ember from 'ember';

export function stringAppend(params/*, hash*/) {
  let returnString= '';
  
  for (let i = 0; i < params.length; i++) {
    returnString = returnString + params[i] + ' ';
  }
  
  return returnString;
}

export default Ember.Helper.helper(stringAppend);
