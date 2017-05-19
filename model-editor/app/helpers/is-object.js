import Ember from 'ember';

export function isObject([arg]) {
  return typeof(arg) === 'object';
}

export default Ember.Helper.helper(isObject);
