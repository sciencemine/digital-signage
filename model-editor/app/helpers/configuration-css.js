import Ember from 'ember';

export function configurationCss([attributes, properties]) {
  let css = "content-area--configuration-section";

  if (attributes) {
    css = css + " content-area--configuration-section__attributes";
  }
  else {
    css = css + " content-area--configuration-section__flush-left";
  }

  if(properties) {
    css = css + " content-area--configuration-section__properties";
  }
  else {
    css = css + " content-area--configuration-section__flush-right";
  }

  return css;
}

export default Ember.Helper.helper(configurationCss);
