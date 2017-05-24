import Ember from 'ember';

export function isList([arg1]) {
  return arg1 === 'list';
}

export default Ember.Helper.helper(isList);
