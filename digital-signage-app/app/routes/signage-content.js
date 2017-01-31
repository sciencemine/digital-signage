import Ember from 'ember';

var signage_content_state = {
  // Access state in .hbs like so: {{model.state.selectedThumbnailIndex}}
  numRelatedVids: 0,
  selectedThumbnailIndex: 0,
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
  afterModel(model, transition) {
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

      m.state.numRelatedVids = 0;
      for (var ndx = 0; ndx < relatedContent.length; ndx++) {
        var thumbnail = document.getElementById(relatedContent[ndx]);
        thumbnail.style.visibility = "visible";
        thumbnail.style.height = "90px";
        thumbnail.style.weight = "160px";
        thumbnail.classList.remove("highlight-video");
        m.state.numRelatedVids++;
      }//for

      var selectThumb = document.getElementById(relatedContent[m.state.selectedThumbnailIndex]);
      selectThumb.classList.add("highlight-video");

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
    },
    
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

document.onkeydown = function(event){
  
     
      var currentSelect = signage_content_state.selectedThumbnailIndex;
      var num = signage_content_state.numRelatedVids;
      var keyPress = event.which || event.keyCode;
      
      var vid = document.getElementById('bkg-vid');
      var pauseButton = document.getElementById('playback-toggle');
      
       var relatedContent = document.getElementById(signage_content_state.currentVidId).dataset.related.split(",");

      
      var selectThumb = document.getElementById(relatedContent[currentSelect]);
      selectThumb.classList.remove("highlight-video");

      console.log(num);
      switch(keyPress){
        case 68:
          currentSelect += 1;
          
          if(currentSelect >= num){
              currentSelect = 0;
          }//if - the selection index is out of bounds
          
          console.log('currentSelect= d');
          break;
        case 65:
           currentSelect -= 1;
           
          if(currentSelect < 0){
              currentSelect = num - 1;
          }//if - the selection index is out of bounds
          
          console.log('currentSelect = a');
          break;
        case 87:
          loadVideo();
          break;
      }
      selectThumb = document.getElementById(relatedContent[currentSelect]);
      selectThumb.classList.add("highlight-video");
      console.log(currentSelect);
      signage_content_state.selectedThumbnailIndex = currentSelect;
 }