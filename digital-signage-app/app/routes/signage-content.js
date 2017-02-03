import Ember from 'ember';

let signage_content_state = {
  // Access state in .hbs like so: {{model.state.selectedThumbnailIndex}}
  numRelatedVids: 0,
  selectedThumbnailIndex: 0,
  startingVidId: null,
  currentVidId: null,
  thumbnailContentType: [],
  timeout: 0,
  modelViewState: 0,
  vidKeys: []
};

let global_model = {

};

let timer;

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

    signage_content_state.modelViewState = model.items[signage_content_state.startingVidId].contentType;

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
  var contentType = [];
  var vidKeys = [];

  vid.setAttribute("src", setFName);
  vid.currentTime = 0;
  signage_content_state.numRelatedVids = 0;
  hideCarousel();

  for (var ndx = 0; ndx < thumbnails.length; ndx++) {
    removeBorder(thumbnails[ndx].id);

    thumbnails[ndx].style.visibility = "hidden";
    thumbnails[ndx].style.maxWidth = "0px";
    thumbnails[ndx].style.padding = "0px";

    if (m.items[inputKey].relatedContent.includes(thumbnails[ndx].id)) {
      thumbnails[ndx].style.visibility = "visible";
      thumbnails[ndx].style.maxWidth = "160px";
      signage_content_state.numRelatedVids++;
      contentType.push(m.items[thumbnails[ndx].id].contentType);
      vidKeys.push(thumbnails[ndx].id);
    }
  }//for

  if (signage_content_state.numRelatedVids !== 0) {
    addBorder(vidKeys[0]);
  }//if

  play(vid, pauseButton);
  signage_content_state.selectedThumbnailIndex = 0;
  signage_content_state.thumbnailContentType = contentType;
  signage_content_state.currentVidId = inputKey;
  signage_content_state.vidKeys = vidKeys;

  vid.addEventListener('ended', function() {
    clearTimeout(timer);
      
    vid.classList.add("darken-video");
    var divTable = document.getElementsByClassName("divTable")[0];
    divTable.style.display = "table";
    pauseButton.innerHTML = "Restart";

    timer = setTimeout( function() {

      if (m.items[inputKey].relatedContent.length > 0) {
        displayVideo(m.items[inputKey].relatedContent[0]);
      }//if
      else {
        displayVideo(signage_content_state.startingVidId);
      }//else
    }, m.config.menu.idle * 1000);
  });
}//displayVideo

function removeBorder(id) {
  document.getElementById(id).classList.remove("highlight-video-adult");
  document.getElementById(id).classList.remove("highlight-video-child");
  document.getElementById(id).classList.remove("highlight-video-both");
}//removeBorder

function addBorder(id) {
  var selectThumb = document.getElementById(id);
  var contentType = global_model.items[id].contentType;
    if (contentType === 0) {
        selectThumb.classList.add("highlight-video-child");
    }//if
    else if(contentType === 1) {
        selectThumb.classList.add("highlight-video-adult");
    }//else
    else {
        selectThumb.classList.add("highlight-video-both");
    }//else
}

function hideCarousel() {
  var menu = document.getElementById('carousel');
  menu.classList.remove('carousel-visible');
}//hideCarousel

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
};//onclick

document.onkeydown = function(event) {
  var keyPress = event.key;
  var currentSelect = signage_content_state.selectedThumbnailIndex;
  var num = signage_content_state.numRelatedVids;
  var vidKeys = signage_content_state.vidKeys;
  var selectThumb = document.getElementById(vidKeys[currentSelect]);

  resetTimer();
  for (var ndx = 0; ndx < vidKeys.length; ndx++) {
    if (vidKeys[0] === "") {
      break;
    }//if

    removeBorder(vidKeys[ndx]);
  }//for

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
    case global_model.config.keyboard.child: {
      if (signage_content_state.modelViewState === 0) {
        displayVideo(vidKeys[currentSelect]);
        currentSelect = 0;
      }//if
      else {
        signage_content_state.modelViewState = 0;
        addBorder(vidKeys[currentSelect]);
      }//else

      break;
    }
    case global_model.config.keyboard.adult: {
      if (signage_content_state.modelViewState === 0) {
        displayVideo(vidKeys[currentSelect]);
        currentSelect = 0;
      }//if
      else {
        signage_content_state.modelViewState = 0;
        addBorder(vidKeys[currentSelect]);
      }//else

      break;
    }
  }//switch

  selectThumb = document.getElementById(vidKeys[currentSelect]);

  if (keyPress !== global_model.config.keyboard.child && keyPress !== global_model.config.keyboard.adult) {
    addBorder(vidKeys[currentSelect]);
  }//if
  
  signage_content_state.selectedThumbnailIndex = currentSelect;
 };//keydown
