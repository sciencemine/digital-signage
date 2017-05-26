import Ember from 'ember';

export function formContentsTextarea(params, hash) {
  let returnHTML = `<textarea data-toggle="tooltip" data-placement="auto top" title="${hash.data.help}" id=${hash.key} class="${hash.class}" placeholder="${hash.placeholder}"`;

  if (hash.data.error) {
    returnHTML = returnHTML + ` oninvalid="setCustomValidity('${hash.data.error}');" oninput="setCustomValidity('');"`;
  } 
  
  for (var key in hash.data.validation) {
    let value = hash.data.validation[key];
    returnHTML = returnHTML + ` ${key}=${value}`;
  }

  returnHTML = returnHTML + `>`;

  if (hash.value) {
    returnHTML = returnHTML + hash.value;
  }

  return Ember.String.htmlSafe(returnHTML + `</textarea>`);
}

export default Ember.Helper.helper(formContentsTextarea);
