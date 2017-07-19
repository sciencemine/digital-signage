import Ember from 'ember';

export function isTextarea([arg]) {
  return arg === "textarea";
}

export default Ember.Helper.helper(isTextarea);
