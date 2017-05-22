import Ember from 'ember';

export function isObject([arg]) {
  return typeof(arg) === 'object' && !Array.isArray(arg);
}

export default Ember.Helper.helper(isObject);
