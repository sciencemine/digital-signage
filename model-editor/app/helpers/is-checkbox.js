import Ember from 'ember';

export function isCheckbox([arg]) {
  return arg === 'checkbox';
}

export default Ember.Helper.helper(isCheckbox);
