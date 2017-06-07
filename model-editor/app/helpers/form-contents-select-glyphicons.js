import Ember from 'ember';

export function formContentsSelectGlyphicons(params, hash) {
  let returnHTML = `<select id=${hash.key} class="${hash.class}">`;

  for (var i= 0; i < hash.data.length; i++) {
    let glyphicon = hash.data[i];
    let name = glyphicon.replace('glyphicon-', '').replace(/-/gi, ' ');

    returnHTML = returnHTML + `<option value=${glyphicon}>${name}</option>`;
  }

  return Ember.String.htmlSafe(returnHTML + `</select>`);
}

export default Ember.Helper.helper(formContentsSelectGlyphicons);
