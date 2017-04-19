import Ember from 'ember';

export function videoSelected([arg1, arg2]) {
  return parseInt(arg1) === parseInt(arg2);
}

export default Ember.Helper.helper(videoSelected);
