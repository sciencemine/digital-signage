import Ember from 'ember';

export default Ember.Controller.extend({
  notify: Ember.inject.service(),
  
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
          let modelData = JSON.parse(fr.result);
          
          if (this.get('modelInformation').versions.find(function(version) {
            return modelData.config.version === version;
          })) {
            this.get('notify').warning("The version of the selected model is not supported.", {
              radius: true,
              closeAfter: 10 * 1000
            })
          }
        };
        
        fr.readAsText(file);
      }
    }
  }
});
