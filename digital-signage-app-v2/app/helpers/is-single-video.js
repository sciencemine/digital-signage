import Ember from 'ember';

export function isSingleVideo([arg]) {
  return Ember.isArray(arg) && arg.length === 1;
}

export default Ember.Helper.helper(isSingleVideo);
