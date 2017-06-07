/*******************************************************************************
 * HELPER:
 *  is-glyphicons
 *
 * DESCRIPTION:
 *  Checks if an argument is a glyphicons.
 * 
 * PARAMETERS:
 *  arg - The argument
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

export function isGlyphicons([arg]) {
  return arg === "glyphicons";
}

export default Ember.Helper.helper(isGlyphicons);
