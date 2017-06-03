import Ember from 'ember';

export function formContentsSelect(params, hash) {
  let returnHTML = `<select data-toggle="tooltip" data-placement="auto top" title="${hash.help}" id=${hash.key} class="${hash.class}">`;

  for (var i= 0; i < hash.data.length; i++) {
    let value = hash.data[i];

    if (typeof(value) === 'object' && !Array.isArray(value)) {
      returnHTML = returnHTML + `<option value=${value.id}>`;
      value = value.data;
    }
    else {
      returnHTML = returnHTML + `<option value=${value}>`;
    }

    returnHTML = returnHTML + `${value}</option>`;
  }

  return Ember.String.htmlSafe(returnHTML + `</select>`);
}

export default Ember.Helper.helper(formContentsSelect);