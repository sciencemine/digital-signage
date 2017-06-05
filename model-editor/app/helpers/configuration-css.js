/*******************************************************************************
 * HELPER:
 *  configuration-css
 *
 * DESCRIPTION:
 *  Creates the css for the configuration panel based on the trueness of the 
 *    parameters given
 * 
 * PARAMETERS:
 *  attributes - Boolean if the attributes panel is expanded
 *  properties - Boolean if the properties panel is expanded
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

export function configurationCss([attributes, properties]) {
  let css = "content-area--configuration-section";

  if (attributes) {
    css = css + " content-area--configuration-section__attributes";
  }
  else {
    css = css + " flush-left";
  }

  if(properties) {
    css = css + " content-area--configuration-section__properties";
  }
  else {
    css = css + " flush-right";
  }

  return css;
}

export default Ember.Helper.helper(configurationCss);
