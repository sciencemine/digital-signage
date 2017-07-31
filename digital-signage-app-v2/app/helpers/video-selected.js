import Ember from 'ember';

export function videoSelected([arg1, arg2]) {
  return arg1.toString() === arg2.toString();
}

export default Ember.Helper.helper(videoSelected);
