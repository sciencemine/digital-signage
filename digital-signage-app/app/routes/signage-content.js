import Ember from 'ember';

var currentVidKey;

export default Ember.Route.extend({

  modelFile: null,

  beforeModel(params) {
    var qp = params.queryParams;
    if (qp.modelfile) {
      this.modelFile = qp.modelfile;
    }
  },
  model() {
    var mf = this.modelFile;

    return Ember.$.getJSON("models/" + (mf ? mf : "Dank") + ".json");
  },
  actions: {
    loadVideo(key) {
      var m = this.modelFor(this.routeName);
      var pauseButton = document.getElementById('playback-toggle');
      var vid = document.getElementById('bkg-vid');
      var setFName = "media/" + m.modelInfo.mediaPath + "/" + m.items[key].fName + ".mp4";

      vid.setAttribute("src", setFName);
      vid.currentTime = 0;

      currentVidKey = key;
     
      play(vid, pauseButton);

      vid.addEventListener('ended', function() {
        pause(vid, pauseButton);
      });
    },
    togglePlayback() {
      var vid = document.getElementById('bkg-vid');
      var pauseButton = document.getElementById('playback-toggle');

      if (vid.paused) {
        play(vid, pauseButton);
      }
      else {
        pause(vid, pauseButton);
      }
    },
    toggleCarousel() {
      var menu = document.getElementById('carousel');

      menu.classList.toggle('carousel-visible');
    }
  }
});

function play(vid, pauseButton) {
  vid.play();
  pauseButton.innerHTML = "Pause";
  vid.classList.remove("darken-video");
}

function pause(vid, pauseButton) {
  vid.pause();
  pauseButton.innerHTML = "Paused";
  vid.classList.add("darken-video");
}