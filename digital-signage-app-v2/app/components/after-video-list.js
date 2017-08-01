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
  
  stackListData: null,
    
  mouseMove() {
    this.get('onInputCallback') ();
  },
  init() {
    this._super(...arguments);
    
    let data = this.get('data');
    
    if (Ember.isArray(data)) {
      data.forEach((attr, attrIndex) => {
        attr.videos.forEach((vid, vidIndex) => {
          if (vid.id) {
            attr.videos[vidIndex] = vid.id;
          }
        });
        
        data[attrIndex] = attr;
      });

      this.setProperties({
        stackListData: data,
        videoListData: data[0].videos
      });
    }
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
    stackListSelected(stackIndex) {
      this.setProperties({
        videoListData: this.get(`stackListData.${stackIndex}.videos`),
        videoListSelectedPos: 0,
        stackListFocus: false
      });
    },
    stackListInput() {
      this.get('onInputCallback') ();
    },
    stackListStackChanged(stackIndex) {
      this.set('videoListData', this.get(`stackListData.${stackIndex}.videos`));
    },

    /* Video List Controller */
    videoListCancelled() {
      this.setProperties({
        stackListFocus: true,
        videoListSelectedPos: -1
      });
    },
    videoListSelected(vidId) {
      let attr = this.get(`data.${this.get('stackListSelectedPos')}`);
      let vidDiff = null;
      
      for (let i = 0; i < attr.videos.length; i++) {
        let element = attr.videos[i];
        
        if (Ember.typeOf(element) === 'object') {
          if (element.id === vidId) {
            vidDiff = element.diff;
            
            break;
          }
        }
        else {
          if (element === vidId) {
            break;
          }
        }
      }
      
      this.get('videoSelectedCallback') (vidId, this.get(`stackListData.${this.get('stackListSelectedPos')}`),  vidDiff);
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
