/**
 * COMPONENT: after-video-list
 *
 * DESCRIPTION:
 *  Called after playback of a video has ended, 
 *  presenting related videos with varying degrees of 
 *  increasing or decreasing difficulty
 *
 * PARAMETERS
 *  data - array of attributes and video keys replaced with objects as follows:
 *  {
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
  videoListSelectedPos: -1,
  
  mouseMove() {
    this.get('onInputCallback');
  },
  init() {
    this._super(...arguments);

    this.set('videoListData', this.get('data')[0].videos);
  },
  actions: {
    /* Stack List Controller */
    stackListHover(videos) {
      this.set('videoListData', videos);
      this.set('videoListSelectedPos', -1);
      this.set('stackListFocus', true);
    },
    stackListCancelled() {
      this.get('onCancelCallback');
    },
    stackListSelected(sender, videos) {
      this.set('videoListData', videos);
      this.set('videoListSelectedPos', 0);
      this.set('stackListFocus', false);
    },
    stackListInput() {
      this.get('onInputCallback');
    },
    stackListStackChanged(videos) {
      this.set('videoListData', videos);
    },

    /* Video List Controller */
    videoListCancelled() {
      this.set('stackListFocus', true);
      this.set('videoListSelectedPos', -1);
    },
    videoListSelected(sender, selected) {
      this.get('videoSelectedCallback') (sender, selected);
    },
    videoListInput() {
      this.get('onInputCallback');
    },
    videoListHover(videoPos) {
      this.set('videoListSelectedPos', videoPos);
      this.set('stackListFocus', false);
    }
  }
});
