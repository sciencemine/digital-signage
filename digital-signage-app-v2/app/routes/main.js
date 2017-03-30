import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return {
      videos: [
      {
        url: "/media/kenny_band_1.mp4",
        title: ""
      },
      {
        url: "/media/kenny_band_2.mp4",
        title: ""
      },
      {
        url: "/media/kenny_flap.mp4",
        title: ""
      },
      {
        url: "/media/kenny_sticks.mp4",
        title: ""
      }
      ]
    };
  }
});
