import Ember from 'ember';

export function formContentsInput(params, hash) {
  let returnHTML = `<input type=${hash.data.inputType} id=${hash.key} class="${hash.class}" oninvalid="setCustomValidity('${hash.data.error}')" placeholder="${hash.placeholder}"`;

  for (var key in hash.data.validation) {
    let value = hash.data.validation[key];
    returnHTML = returnHTML + ` ${key}=${value}`;
  }

  return Ember.String.htmlSafe(returnHTML + ` />`);
}

export default Ember.Helper.helper(formContentsInput);
