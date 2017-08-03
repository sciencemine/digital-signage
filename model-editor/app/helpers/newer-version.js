import Ember from 'ember';

export function newerVersion(params, hash) {
  return Ember.isPresent(hash.old) && Ember.isPresent(hash.new) && hash.old < hash.new;
}

export default Ember.Helper.helper(newerVersion);
