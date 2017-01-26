/*
 * Science Mine Digital Signage Project
 * JavaScript for DS Project
 * Phillip J. Curtiss, PhD
 * Science Mine Board Member
 * (C) 2016 Science Mine, Inc.
 * All Rights Reserved
 */

 // Global Variables
var vid,			// Main video object
    pauseButton,	// pauseButton
	menuButton;		// menuButton

// Init - registers event listeners
function init() {
	
// Obtain elements from the page once it is loaded
	vid = document.getElementById('bgvid');
	pauseButton = document.getElementById('vidpause');
	menuButton = document.getElementById('menuSlide');

  // Register listener that cycles through videos upon video 
  // play ending 
  vid.addEventListener('ended', function() {
      // only functional if "loop" is removed 
       vid.pause();
  	// to capture IE10
  	vidFade();
  });

  pauseButton.addEventListener("click", function() {
      vid.classList.toggle('stopfade');
  	if (vid.paused) {
  		vid.play();
  		pauseButton.innerHTML = "Pause";
  	}
    else {
          vid.pause();
          pauseButton.innerHTML = "Paused";
  	}
  });

  menuButton.addEventListener("click", function() {

    var me = document.getElementById('menu');

  	me.classList.toggle('slide');
  });
}

// Helper functions
function vidFade() {
    vid.classList.add("stopfade");
}

init();
