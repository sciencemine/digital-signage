import Ember from 'ember';

export function notCheckbox([arg]) {
  return arg !== 'checkbox';
}

export default Ember.Helper.helper(notCheckbox);
