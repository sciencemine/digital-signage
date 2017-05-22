import Ember from 'ember';

export function formContentsSelect(params, hash) {
  let returnHTML = `<select id=${hash.key} class="${hash.class}">`;

  for (var i= 0; i < hash.data.length; i++) {
    let value = hash.data[i];
    returnHTML = returnHTML + `<option>${value}</option>`;
  }

  return Ember.String.htmlSafe(returnHTML + `</select>`);
}

export default Ember.Helper.helper(formContentsSelect);
