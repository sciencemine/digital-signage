/*
COMPONENT: video-player

Public Actions:
  setMuted(bool)
    If param1 is true, the video will not play sound.
    If false, video will play sound

  getMuted(bool)
    Return false if the video player is playing sound,
    otherwise false

  
  setPlaying(bool)
    If param1 is true, the video will play
    If false, the video will stay on it's current frame

  getPlaying()
    Return true if the video is currently playing,
    otherwise false

  setLooping(bool)
    If param1 is true, the video will loop indefinitely
    If false, the video will stop playing at the end

  getLooping()
    Return true if the video will loop,
    otherwise false
  
  setUrl(url)
    Set the url of the video to be played to param1
    The video should load, and match the previous
    muted/playing state
    
  getUrl()
    Return the URL of the currently playing video

Parameters:
  url
    If startUrl is passed in, load the video at that url
    immediately. Otherwise, leave video blank until setUrl()
    is called.

  looping
    If looping is true, start video in a looping state
    If looping is false start video in a non-looping state
    default: false
    
  playing
    If playing is true, start video in a playing state
    If playing is false start video in a non-playing state
    default: true

  muted
    If muted is true, start video in a muted state
    If muted is false start video in a non-muted state
    default: true

Callbacks:
  onCompletedCallback(sender)
    This is an action that will be passed in as a parameter.
    Call this action using this.get('onCompletedCallback')()
    when the video has played to completion and and looping is
    disabled.
*/

import Ember from 'ember';

export default Ember.Component.extend({
});
