import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    this._super(...arguments);
    this.replaceWith('idle');
  }
});

// function randomIdleUrl(data) {
//   var arrayLength = data.items.length;

//   return 'idle/' + parseInt((Math.random() * arrayLength));
// }

/*
, function() {
      var data = Ember.$.getJSON("playlist.json");
      var arrayLength = data.items.legth;
      var index = parseInt((Math.random() * arrayLength));
      var url = 'idle/:' + index;

      return url;
    }}
*/