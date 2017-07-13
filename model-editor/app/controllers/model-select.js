import Ember from 'ember';

export default Ember.Controller.extend({
  modelInformation: { },
  backgroundVideos: [ ],

  checkVersion: function() {
    
  },
  actions: {
    readModel() {
      let selectedFiles = Ember.$('#fileUpload')[0];
      
      if (selectedFiles.files[0]) {
        let file = selectedFiles.files[0];
        let fr = new FileReader();
        
        fr.onload = function() {
          console.log(JSON.parse(fr.result));
        };
        
        fr.readAsText(file);
      }
    }
  }
});
