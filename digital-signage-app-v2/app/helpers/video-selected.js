/**
 * HELPER: video-selected
 *
 * DESCRIPTION:
 *  Determines if the video is selected. true if arg1 === arg2 false otherwise
 *
 * PARAMETERS
 *  arg1, arg2
 *
 * @author Michael Fryer
 * @date 5/11/2017
 */
import Ember from 'ember';

export function videoSelected([arg1, arg2]) {
  return parseInt(arg1) === parseInt(arg2);
}

export default Ember.Helper.helper(videoSelected);
