import Ember from 'ember';

export function isValidInputType([arg1]) {
  return arg1 === 'text' || arg1 === 'dropdown' || arg1 === 'number' || arg1 === 'checkbox';
}

export default Ember.Helper.helper(isValidInputType);
