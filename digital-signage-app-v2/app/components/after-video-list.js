/**
 * COMPONENT: after-video-list
 *
 * DESCRIPTION:
 *  Called after playback of a video has ended, 
 *  presenting related videos with varying degrees of 
 *  increasing or decreasing difficulty
 *
 * PARAMETERS
 *  
 * 
 *  data - object with keys of attributes and video keys replaced with objects as follows:
 *  "": {
 *    "prettyName": "",
 *    "description": "",
 *    "x": 0,
 *    "y": 0,
 *    "videos": [
 *      {
 *        "prettyName": "",
 *        "description": "",
 *        "attributes": [ ],
 *        "relations": [
 *          {
 *            "relatedId": "",
 *            "difficulty": 1,
 *            "attributeId": ""
 *          }
 *        ],
 *        "full": {
 *          "fileIdentifier": "",
 *          "isUrl": false,
 *          "attribution": ""
 *        },
 *        "teaser": {
 *          "fileIdentifier": "",
 *          "isUrl": false,
 *          "attribution": ""
 *        }
 *      }
 *    ]
 *  }
 *
 * @authors Michael Fryer, Zach Valenzuela, Alex Reid
 * @date 6/15/2017
 */

import Ember from 'ember';

export default Ember.Component.extend({
  videoListData: null,
  stackListFocus: true,
  stackListSelectedPos: 0,
  videoListSelectedPos: 0,

  init() {
    this._super(...arguments);

    this.set('videoListData', this.get('data')[0].videos);
  },
  didRender() {

  },
  actions: {
    /* Stack List Controller */
    stackListHover(videos) {
      this.set('videoListData', videos);
      
      this.set('stackListFocus', true);
    },
    stackListCancelled() {
      console.log('Stack list canceled');
    },
    stackListSelected(sender, videos) {
      this.set('videoListData', videos);
    },
    stackListInput() {
      this.get('onInputCallback');
    },
    stackListOverflow() {
      this.set('stackListFocus', false);
      this.set('videoListSelectedPos', 0);
    },
    stackListUnderflow() {
      let stack = this.get('data')[this.get('stackListSelectedPos')];

      this.set('stackListFocus', false);
      this.set('videoListSelectedPos', stack.videos.length - 1);
    },
    stackListStackChanged(videos) {
      this.set('videoListData', videos);
    },
    /* Video List Controller */
    videoListCancelled() {
      this.set('stackListFocus', true);
    },
    videoListSelected(sender, selected) {
      this.get('videoSelectedCallback') (sender, selected);
    },
    videoListInput() {
      this.get('onInputCallback');
    },
    videoListOverflow() {
      this.set('stackListFocus', true);

      this.set('stackListSelectedPos', 0);
    },
    videoListUnderflow() {
      this.set('stackListFocus', true);

      this.set('stackListSelectedPos', this.get('data').length - 1);
      this.set('videoListData', this.get('data')[this.get('stackListSelectedPos')].videos);
    },
    videoListHover(videoPos) {
      this.set('videoListSelectedPos', videoPos);
      
      this.set('stackListFocus', false);
    }
  }
});
