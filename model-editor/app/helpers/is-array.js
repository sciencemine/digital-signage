import Ember from 'ember';

export function isArray([arg]) {
  return Array.isArray(arg);
}

export default Ember.Helper.helper(isArray);
