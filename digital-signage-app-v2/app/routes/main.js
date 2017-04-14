import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return {
      config: {
          prettyName: "Demo",
          mediaPath: "path/to/media",
          ui: {
              dwell: 3,
              idle: 15,
              menuLocale: "top"
          },
          keyboard: {
              select: "d",
              previous: "a",
              cancel: "s",
              next: "h"
          }
      },
      tags: {
          big: "this is big",
          thing: "this is a thing"
      },
      videos: [
          {
              name: "thing 1",
              desc: "Introduction to the thing",
              fileName: "/media/kenny_band_1.mp4",
              tags: ["thing"],
              attribuion: "Bob",
              caption: "This is an introduction to what the thing is about!"
          },
          {
              name: "thing 2",
              desc: "Large thing",
              fileName: "/media/kenny_band_2.mp4",
              tags: ["thing", "big"],
              attribution: "Bob",
              caption: "More about the thing, just bigger."
          },
          {
              name: "stuff 1",
              desc: "Introduction to the stuff",
              fileName: "/media/kenny_flap.mp4",
              tags: ["stuff"],
              attribuion: "Bob",
              caption: "This is an introduction to what the stuff is about!"
          },
          {
              name: "stuff 2",
              desc: "Large stuff",
              fileName: "/media/kenny_sticks.mp4",
              tags: ["stuff", "big"],
              attribution: "Bob",
              caption: "More about the stuff, just bigger."
          }
      ],
      relations: [
          {
              initialVideo: "vid1",
              finalVideo: "vid2",
              difficulty: 3,
              tags: ["thing"]
          }
      ]
    };
  }
});
