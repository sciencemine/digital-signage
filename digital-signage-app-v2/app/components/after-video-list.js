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

import AbstractList from './abstract-list';
export default AbstractList.extend({


<<<<<<< HEAD
=======
export default Ember.Component.extend({
  videoListData: null,

  init() {
    this._super(...arguments);

    this.set('videoListData', this.get('data')['history'].videos);
  },
  didRender() {

  },
  actions: {
    /* Stack List Controller */
    stackListHover() {

    },
    stackListCancel() {

    },
    stackListSelect() {

    },
    stackListInput() {

    },
    /* Video List Controller */
    videoListCancel() {

    },
    videoListSelect(){

    },
    videoListInput() {

    },
  }
>>>>>>> 674bfe0c019579184a2a9a569ea09dd72d5c4bff
});
