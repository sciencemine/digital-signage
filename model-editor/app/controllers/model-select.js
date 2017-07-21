import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Controller.extend({
  notify: service(),
  modelService: service(),

  checkVersion: function(inputVersion) {
    return this.get('modelService.modelInformation').versions.find(function(version) {
      return inputVersion === version;
    });
  },
  actions: {
    readModel() {
      let selectedFiles = Ember.$('#fileUpload')[0];

      if (selectedFiles.files[0]) {
        let file = selectedFiles.files[0];
        let fr = new FileReader();
        let controller = this;
        
        fr.onload = function() {
          let modelData = JSON.parse(fr.result);
          let validVersion = controller.checkVersion(modelData.config.version);
          
          if (validVersion) {
            controller.get('modelService').loadModelData(modelData);
            
            controller.transitionToRoute('modelEdit');
          }
          else {
            controller.get('notify').warning("The version of the selected model is not supported.", {
              radius: true,
              closeAfter: 10 * 1000
            });
          }
        };
        
        fr.readAsText(file);
      }
    },
    transition(data) {
      this.get('modelService').loadModelData(data);
      
      this.transitionToRoute('modelEdit');
    },
    newExhibit() {
      let modelService = this.get('modelService');
      
      (function(controller) {
        Ember.$.getJSON('models/ModelSkeleton' + modelService.get('modelInformation').newestVersion + '.json').then(function(data) {
          modelService.loadModelData(data);
          
          controller.transitionToRoute('modelEdit');
        });
      }) (this);
    }
  }
});
