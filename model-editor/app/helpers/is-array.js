import Ember from 'ember';

export function isArray([arg]) {
  return Ember.isArray(arg);
}

export default Ember.Helper.helper(isArray);
