import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Controller.extend({
  notify: service(),
  modelService: service(),

  checkVersion: function(inputVersion) {
    return this.get('modelService.modelInformation').versions.indexOf(inputVersion) !== -1;
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
    },
    updateModel(data) {
      let modelService = this.get('modelService');
      let path = `models/ModelDefaults${modelService.get('modelInformation.newestVersion')}.json`;
      
      modelService.loadModelData(data);
    
      (function(route) {
        Ember.$.getJSON(path).then((data) => {
          modelService.loadDefaultValues(data);
          
          modelService.saveModel();
        }).fail(() => {
          route.get('notify').warning("Could not pull data to update model. Using old version.", {
            radius: true,
            closeAfter: 10 * 1000
          });
        });
      }) (this);
    }
  }
});
