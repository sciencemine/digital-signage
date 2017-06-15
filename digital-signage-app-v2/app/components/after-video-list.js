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


});
