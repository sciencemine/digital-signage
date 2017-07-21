import Ember from 'ember';

export function isGlyphicons([arg]) {
  return arg === "glyphicons";
}

export default Ember.Helper.helper(isGlyphicons);
