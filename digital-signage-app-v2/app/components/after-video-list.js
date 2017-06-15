import Ember from 'ember';

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
});
