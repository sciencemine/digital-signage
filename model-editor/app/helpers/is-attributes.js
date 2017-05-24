import Ember from 'ember';

export function isAttributes([arg]) {
  return arg === 'attributes';
}

export default Ember.Helper.helper(isAttributes);
