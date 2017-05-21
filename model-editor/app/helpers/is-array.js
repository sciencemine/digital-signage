import Ember from 'ember';

export function isArray([arg]) {
  if (Array.isArray(arg)) {
    return arg.length > 0;
  }
  return false;
}

export default Ember.Helper.helper(isArray);
