import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    fileUpload(data) {console.log('baba')
      console.log(this.$('#fileUpload'))
    }
  }
});
