import Ember from 'ember';

export function isRelations([arg]) {
  return arg === 'relations';
}

export default Ember.Helper.helper(isRelations);
