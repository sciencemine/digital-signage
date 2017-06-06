import Ember from 'ember';

export default Ember.Route.extend({
  modelfile: null,
  modelData: null,
  version: null, 

  beforeModel(params) {
    let qp = params.queryParams;

    if (!qp.modelfile) {
      this.replaceWith('modelSelect');
    }
    
    this.version = qp.version;

    return Ember.$.getJSON("models/" + qp.modelfile + ".json").then((res) => {
      if (qp.modelfile === "ModelSkeleton") {
        res.config.prettyName = "New Exhibit";
        res.config.description = "Creating a new exhibit!";
      }
      
      this.modelData = res;
    });
  },
  model() {
    let path = "models/ModelVersion" + (this.modelData.config.version ? this.modelData.config.version : this.version) + ".json";
    let route = this;
    let data = {};

    data.modelData = this.modelData;

    return Ember.$.getJSON(path).then((modelConfig) => {
      data.modelData.version = modelConfig.config.data.version.data;
      data.modelConfig = modelConfig;

      return data;
    }).fail(() => {
      route.transitionTo('modelSelect');
    });
  }
});
