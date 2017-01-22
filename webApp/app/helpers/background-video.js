import Ember from 'ember';

export default Ember.Helper.helper(function(url) {
  var link = Ember.Handlebars.Utils.escapeExpression(url);
  return Ember.String.htmlSafe(`<video 
          autoplay playsinline loop><source src="videos/${url}"
          type="video/mp4"><\\video>`);
});