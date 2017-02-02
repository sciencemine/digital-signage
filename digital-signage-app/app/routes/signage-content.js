import Ember from 'ember';

let signage_content_state = {
  // Access state in .hbs like so: {{model.state.selectedThumbnailIndex}}
  numRelatedVids: 0,
  selectedThumbnailIndex: 0,
  startingVidId: null,
  thumbnailContentType: [],
  timeout: 0,
  vidKey: []
};

let global_model = {

};

var timer;

export default Ember.Route.extend({
  modelFile: null,

  beforeModel(params) {
    var qp = params.queryParams;

    if (qp.modelfile) {
      this.modelFile = qp.modelfile;
    }
  },
  model() {
    var path = "models/" + (this.modelFile ? this.modelFile : "Demo") + ".json";
    var data = Ember.$.getJSON(path);

    return data;
  },
  afterModel(model) {
    // Add the state to the model for easy access within handlebars
    signage_content_state.timeout = model.config.menu.dwell;
    global_model = model;
    for (var key in model.items) {
      signage_content_state.startingVidId = key;
      break;
    }

    model["state"] = signage_content_state;
   
    return model;
  },
  init() {
    clearTimeout(timer);
    timer = setTimeout( function() {
      displayVideo(signage_content_state.startingVidId);

    }, 100);
  },
  actions: {
    loadVideo(inputKey) {
      displayVideo(inputKey);
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

function displayVideo(inputKey) {
  var m = global_model;
  var pauseButton = document.getElementById('playback-toggle');
  var vid = document.getElementById('bkg-vid');
  var setFName = m.modelInfo.mediaPath + m.items[inputKey].fName + ".mp4";
  var thumbnails = document.getElementsByClassName('thumbnail');
  var relatedContent = document.getElementById(inputKey).dataset.related.split(",");
  var menu = document.getElementById('carousel');
  var thumbnail;
  var contentType = [];
  var vidKey = [];

  vid.setAttribute("src", setFName);
  vid.setAttribute("data-related", relatedContent);
  vid.currentTime = 0;

  for (var ndx = 0; ndx < thumbnails.length; ndx++) {
    toggleBox(thumbnails[ndx].id);

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
    vidKey.push(relatedContent[ndx]);
  }//for

  if (signage_content_state.numRelatedVids !== 0) {
    thumbnail = document.getElementById(relatedContent[0]);
    if (m.items[relatedContent[0]].contentType === 0) {
      thumbnail.classList.add("highlight-video-child");
    }//if
    else {
      thumbnail.classList.add("highlight-video-adult");
    }//else
  }//if

  play(vid, pauseButton);
  menu.classList.remove('carousel-visible');
  signage_content_state.startingVidId = inputKey;
  signage_content_state.selectedThumbnailIndex = 0;
  signage_content_state.thumbnailContentType = contentType;
  signage_content_state.vidKey = vidKey;

  m.state = signage_content_state;

  vid.addEventListener('ended', function() {
    pause(vid, pauseButton);
  });
}//displayVideo

function toggleBox(id) {
  document.getElementById(id).classList.remove("highlight-video-adult");
  document.getElementById(id).classList.remove("highlight-video-child");
}//toggleBox

function play(vid, pauseButton) {
  vid.play();
  pauseButton.innerHTML = "Pause";
  vid.classList.remove("darken-video");
  resetTimer();
}//play

function pause(vid, pauseButton) {
  clearTimeout(timer);
  vid.pause();
  pauseButton.innerHTML = "Paused";
  vid.classList.add("darken-video");
  var divTable = document.getElementsByClassName("divTable")[0];
  divTable.style.display = "table";
  timer = setTimeout( function() {
    play(vid, pauseButton);
  }, signage_content_state.timeout * 5 * 1000);
}//pause

function resetTimer() {
  if (document.getElementById("playback-toggle").innerHTML === "Paused") {
    return;
  }//if
  var divTable = document.getElementsByClassName("divTable")[0];
  clearTimeout(timer);

  divTable.style.display = "table";
  timer = setTimeout( function() {
    divTable.style.display = "none";

  }, signage_content_state.timeout * 1000);

}//resetTimer

document.onclick = function() {
  resetTimer();
};

document.onkeydown = function(event) {
  var keyPress = event.key;
  var currentSelect = signage_content_state.selectedThumbnailIndex;
  var num = signage_content_state.numRelatedVids;
  var contentType = signage_content_state.thumbnailContentType;
  var vidKey = signage_content_state.vidKey;
  var relatedContent = document.getElementById(signage_content_state.startingVidId).dataset.related.split(",");
  var selectThumb = document.getElementById(relatedContent[currentSelect]);

  resetTimer();

  if (keyPress === global_model.config.keyboard.right || keyPress === global_model.config.keyboard.left) {
    if(contentType[currentSelect] === 0) {
       selectThumb.classList.remove("highlight-video-child");
    }//if
    else {
       selectThumb.classList.remove("highlight-video-adult");
    }//else
  }//if

  switch(keyPress) {
    case global_model.config.keyboard.right: {
      currentSelect = currentSelect + 1;
      
      if(currentSelect >= num) {
          currentSelect = 0;
      }//if - the selection index is out of bounds

      break;
    }
    case global_model.config.keyboard.left: {
       currentSelect = currentSelect - 1;
       
      if(currentSelect < 0) {
          currentSelect = num - 1;
      }//if - the selection index is out of bounds      

      break;
    }
    case global_model.config.keyboard.select: {

      displayVideo(vidKey[currentSelect]);

      break;
    }
    case global_model.config.keyboard.select: {
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
 };//keydown
