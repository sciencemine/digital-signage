import Ember from 'ember';

export function isObject([arg]) {
  return Ember.typeOf(arg) === 'object' || Ember.typeOf(arg) === 'instance';
}

export default Ember.Helper.helper(isObject);
