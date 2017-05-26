import Ember from 'ember';

export function formContentsInput(params, hash) {
  let returnHTML = `<input data-toggle="tooltip" data-placement="auto top" title="${hash.data.help}" type=${hash.data.inputType} id=${hash.key} class="${hash.class}" placeholder="${hash.placeholder}"`;

  if (hash.data.error) {
    returnHTML = returnHTML + ` oninvalid="setCustomValidity('${hash.data.error}');" oninput="setCustomValidity('');"`;
  }  

  if (hash.value) {
     returnHTML = returnHTML + `value="${hash.value}"`;
  }

  for (var key in hash.data.validation) {
    let value = hash.data.validation[key];
    returnHTML = returnHTML + ` ${key}=${value}`;
  }

  return Ember.String.htmlSafe(returnHTML + ` />`);
}

export default Ember.Helper.helper(formContentsInput);
