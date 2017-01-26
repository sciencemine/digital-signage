import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.$.getJSON("playlist.json");
  },
  actions: {
    loadVideo(url) {
      var exportUrl = "videos/" + url + ".mp4";
      document.getElementById('bgvid').setAttribute("src", exportUrl);
      document.getElementById('bgvid').currentTime = 0;
      document.getElementById('bgvid').play();
    }
  }
});