import Ember from 'ember';

export function textareaCss([arg]) {
  let css = "form-control input-sm";

  if (arg === true) {
    css = css + " resize-horizontal";
  }
  else {
    css = css + " resize-vertical";
  }

  return css;
}

export default Ember.Helper.helper(textareaCss);
