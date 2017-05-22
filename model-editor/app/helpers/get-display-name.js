import Ember from 'ember';

export function getDisplayName([arg1, arg2]) {
  return arg1[arg2].displayName;
}

export default Ember.Helper.helper(getDisplayName);
