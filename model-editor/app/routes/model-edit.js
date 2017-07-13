import Ember from 'ember';

export default Ember.Route.extend({
  modelfile: null,
  modelData: null,
  
  beforeModel(params) {
    let qp = params.queryParams;

    if (!qp.modelfile) {
      this.replaceWith('modelSelect');
    }

    return Ember.$.getJSON("models/" + qp.modelfile + ".json").then((res) => {
      if (qp.modelfile === "ModelSkeleton") {
        res.config.prettyName = "New Exhibit";
        res.config.description = "Creating a new exhibit!";
      }
      
      this.modelfile = qp.modelfile;
      this.modelData = res;
    });
  },
  model() {
    let path = "models/ModelVersion" + this.modelData.config.version + ".json";
    let route = this;
    let data = {};

    data.modelData = this.modelData;

    return Ember.$.getJSON(path).then((modelConfig) => {
      data.modelConfig = modelConfig;
      data.modelfile = this.modelfile;

      return data;
    }).fail(() => {
      route.transitionTo('modelSelect');
    });
  }
});
