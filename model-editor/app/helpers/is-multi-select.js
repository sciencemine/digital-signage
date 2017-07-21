import Ember from 'ember';

export function isMultiSelect([arg]) {
  return arg === "multi-select";
}

export default Ember.Helper.helper(isMultiSelect);
