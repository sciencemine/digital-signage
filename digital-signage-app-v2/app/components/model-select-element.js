import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "button",
  classNames: [ "list-group-item" ],
  
  muted: true,
  name: "",
  description: "",
  modelIdentifier: "",
  videos: [ ],
  playingPos: 0,
  
  playingVid: Ember.computed('playingPos', function() {
    return this.get(`videos.${this.get('playingPos')}`);
  }),
  mouseEnter() {
    this.set('muted', false);
  },
  mouseLeave() {
    this.set('muted', true);
  },
  actions: {
    doNothing() {
      
    },
    cycleVideo() {
      let bgArrayLength = this.get('videos').length;
      let curBgVidPos = this.get('playingPos');

      this.set('playingPos', (curBgVidPos + 1) % bgArrayLength);
    }
  }
});
