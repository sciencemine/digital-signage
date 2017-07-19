import Ember from 'ember';

export function getData([arg1, arg2]) {
  return arg1[arg2];
}

export default Ember.Helper.helper(getData);
