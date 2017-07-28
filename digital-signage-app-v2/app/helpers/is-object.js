import Ember from 'ember';

export function isObject([arg]) {
  return Ember.typeOf(arg) === 'object';
}

export default Ember.Helper.helper(isObject);
