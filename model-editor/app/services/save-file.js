import Ember from 'ember';
const path = require('path');
const fs = require('fs');

export default Ember.Service.extend({
  init() {
    this._super(...arguments);
  },
  save(json) {
    console.log(path.dirname(require.main.filename))
  }
});
