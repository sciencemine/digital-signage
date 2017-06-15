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
    },
    stackListCancelled() {
      console.log('Stack list canceled');
    },
    stackListSelected(videos) {
      this.set('videoListData', videos);
    },
    stackListInput() {
      this.get('onInputCallback');
    },
    stackListOverflow() {
      this.set('stackListFocus', false);
    },
    stackListUnderflow() {
      this.set('stackListFocus', false);
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
    },
    videoListUnderflow() {
      this.set('stackListFocus', true);
    }
  }
});
