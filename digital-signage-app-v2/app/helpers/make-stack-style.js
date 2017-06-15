import Ember from 'ember';

export function makeStackStyle([arg1, arg2]) {
  return Ember.String.htmlSafe(`left: ${arg1}%; top: ${arg2}%;`);
}

export default Ember.Helper.helper(makeStackStyle);
