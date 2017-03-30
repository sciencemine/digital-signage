import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return {
      videos: [
      {
        url: "/media/kenny_vid.mp4",
        title: ""
      },
      {
        url: "/media/sintel_trailer.mp4",
        title: ""
      }
      ]
    };
  }
});
