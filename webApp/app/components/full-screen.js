import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    fullscreen() {
      var elem = document.querySelector("#fs");

      if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
      else {
        if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        }
        else {
          elem.requestFullscreen();
        }
      }
    }
  }
});
