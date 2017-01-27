import Ember from 'ember';

export default Ember.Route.extend({

  playlistName: null,

  beforeModel(params) {
    var qp = params.queryParams;
    if (qp.playlistname) {
      this.playlistName = qp.playlistname;
    }
  },

  model() {
    var pn = this.playlistName;
    return Ember.$.getJSON((pn ? pn : "playlist") + ".json");
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