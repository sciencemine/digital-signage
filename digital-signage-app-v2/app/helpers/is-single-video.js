import Ember from 'ember';

export function isSingleVideo([arg]) {
  return arg.length === 1;
}

export default Ember.Helper.helper(isSingleVideo);
