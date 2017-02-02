import Ember from 'ember';

let signage_content_state = {
  // Access state in .hbs like so: {{model.state.selectedThumbnailIndex}}
  numRelatedVids: 0,
  selectedThumbnailIndex: 0,
  currentVidId: null,
  thumbnailContentType: []
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
      var menu = document.getElementById('carousel');
      var thumbnail;
      var contentType = [];

      vid.setAttribute("src", setFName);
      vid.currentTime = 0;

      for (var ndx = 0; ndx < thumbnails.length; ndx++) {
        if (m.items[thumbnails[ndx].dataset.id] === 0) {
          thumbnails[ndx].classList.remove("highlight-child-video");
        }//if
        else {
          thumbnails[ndx].classList.remove("highlight-adult-video");
        }//if

        thumbnails[ndx].style.visibility = "hidden";
        thumbnails[ndx].style.height = "0px";
        thumbnails[ndx].style.maxWidth = "0px";
        thumbnails[ndx].style.padding = "0px";
      }//for

      signage_content_state.numRelatedVids = 0;

      for (ndx = 0; ndx < relatedContent.length; ndx++) {
        thumbnail = document.getElementById(relatedContent[ndx]);
        thumbnail.style.visibility = "visible";
        thumbnail.style.height = "90px";
        thumbnail.style.maxWidth = "160px";
        signage_content_state.numRelatedVids++;
        contentType.push(m.items[relatedContent[ndx]].contentType);
      }//for

      if (signage_content_state.numRelatedVids !== 0) {
        thumbnail = document.getElementById(relatedContent[0]);
        if (m.items[relatedContent[0]].contentType === 0) {
          thumbnail.classList.add("highlight-video-child");
        }//if
        else {
          thumbnail.classList.add("highlight-video-adult");
        }//else
      }//ifd

      play(vid, pauseButton);
      menu.classList.remove('carousel-visible');
      signage_content_state.currentVidId = inputKey;
      signage_content_state.selectedThumbnailIndex = 0;
      signage_content_state.thumbnailContentType = contentType;

      m.state = signage_content_state;

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

document.onkeydown = function(event) {
  var currentSelect = signage_content_state.selectedThumbnailIndex;
  var num = signage_content_state.numRelatedVids;
  var contentType = signage_content_state.thumbnailContentType;
  var keyPress = event.which || event.keyCode;
  var relatedContent = document.getElementById(signage_content_state.currentVidId).dataset.related.split(",");
  var selectThumb = document.getElementById(relatedContent[currentSelect]);

  if(contentType[currentSelect] === 0) {
     selectThumb.classList.remove("highlight-video-child");
  }//if
  else {
     selectThumb.classList.remove("highlight-video-adult");
  }//else

  switch(keyPress) {
    case 68: {
      currentSelect += 1;
      
      if(currentSelect >= num) {
          currentSelect = 0;
      }//if - the selection index is out of bounds

      break;
    }
    case 65: {
       currentSelect -= 1;
       
      if(currentSelect < 0) {
          currentSelect = num - 1;
      }//if - the selection index is out of bounds      

      break;
    }
    case 87: {

      loadVideo(currentSelect);

      break;
    }
  }//switch

  selectThumb = document.getElementById(relatedContent[currentSelect]);

  if(contentType[currentSelect] === 0) {
      selectThumb.classList.add("highlight-video-child");
  }//if
  else {
      selectThumb.classList.add("highlight-video-adult");
  }//else
  
  signage_content_state.selectedThumbnailIndex = currentSelect;
 };