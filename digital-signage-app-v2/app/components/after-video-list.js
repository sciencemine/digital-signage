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
    this.get('onInputCallback') ();
  },
  init() {
    this._super(...arguments);

    this.set('videoListData', this.get(`data.${0}.videos`));
  },
  actions: {
    /* Stack List Controller */
    stackListHover(videos) {
      this.setProperties({
        videoListData: videos,
        videoListSelectedPos: -1,
        stackListFocus: true
      });
    },
    stackListCancelled() {
      this.get('onCancelCallback') ();
    },
    stackListSelected(stackId) {
      this.setProperties({
        videoListData: this.get(`data.${stackId}.videos`),
        videoListSelectedPos: 0,
        stackListFocus: false
      });
    },
    stackListInput() {
      this.get('onInputCallback') ();
    },
    stackListStackChanged(stackId) {
      this.set('videoListData', this.get(`data.${stackId}.videos`));
    },

    /* Video List Controller */
    videoListCancelled() {
      this.setProperties({
        stackListFocus: true,
        videoListSelectedPos: -1
      });
    },
    videoListSelected(vidId) {
      this.get('videoSelectedCallback') (vidId);
    },
    videoListInput() {
      this.get('onInputCallback') ();
    },
    videoListHover(videoPos) {
      this.setProperties({
        videoListSelectedPos: videoPos,
        stackListFocus: false
      });
    }
  }
});
