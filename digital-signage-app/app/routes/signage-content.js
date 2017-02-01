import Ember from 'ember';

var signage_content_state = {
  // Access state in .hbs like so: {{model.state.selectedThumbnailIndex}}
  displayedThumbnails: [],
  selectedThumbnailIndex: -1,
  currentVidId: null
};

export default Ember.Route.extend({

  modelFile: null,

  beforeModel(params) {
    var qp = params.queryParams;

    if (qp.modelfile) {
      this.modelFile = qp.modelfile;
    }
  },
  model() {
    var path = "models/" + (this.modelFile ? this.modelFile : "Dank") + ".json";
    var data = Ember.$.getJSON(path);

    return data;
  },
  afterModel(model) {
    // Add the state to the model for easy access within handlebars
    model["state"] = signage_content_state;
    return model;
  },
  actions: {
    loadVideo(inputKey) {
      var m = this.modelFor(this.routeName);
      var pauseButton = document.getElementById('playback-toggle');
      var vid = document.getElementById('bkg-vid');
      var setFName = "media/" + m.modelInfo.mediaPath + "/" + m.items[inputKey].fName + ".mp4";
      var thumbnails = document.getElementsByClassName('thumbnail');
      var relatedContent = document.getElementById(inputKey).dataset.related.split(",");

      vid.setAttribute("src", setFName);
      vid.currentTime = 0;

      for (var ndx = 0; ndx < thumbnails.length; ndx++) {
        thumbnails[ndx].style.visibility = "hidden";
        thumbnails[ndx].style.height = "0px";
        thumbnails[ndx].style.weight = "0px";
      }//for

      for (var ndx = 0; ndx < relatedContent.length; ndx++) {
        var thumbnail = document.getElementById(relatedContent[ndx]);
        thumbnail.style.visibility = "visible";
        thumbnail.style.height = "90px";
        thumbnail.style.weight = "160px";
      }//for

      m.state.currentVidId = inputKey;

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