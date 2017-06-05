import Ember from 'ember';

export function makeStackStyle([arg1, arg2]) {
  let left = arg1 * 100;
  let top = arg2 * 100;
  return Ember.String.htmlSafe(`left: ${left}%; top: ${top}%;`) ; 
}

export default Ember.Helper.helper(makeStackStyle);
