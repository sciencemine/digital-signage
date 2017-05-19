import Ember from 'ember';

export default Ember.Route.extend({
  modelfile: null,
  newModel: null,
  modelConfig: null,

  beforeModel(params) {
    let qp = params.queryParams;

    if (qp.modelfile) {
      this.modelfile = qp.modelfile;
    }
    else {
      this.replaceWith('modelSelect');
    }

    return Ember.$.getJSON("models/modelConfiguration.json").then((res) => {
      this.modelConfig = res;
    });
  },
  model() {
    let path = "models/" + this.modelfile + ".json";
    let route = this;
    let data = {};

    data.modelConfig = this.modelConfig;

    return Ember.$.getJSON(path).then((modelData) => {

      if (this.modelfile === "ModelSkeleton") {
        modelData.config.prettyName = "Exhibit Creation";
        modelData.config.description = "Creating an exhibit model";
      }

      this.newModel = modelData;
      data.modelData = modelData;

      return data;
    }).fail(() => {
      route.transitionTo('modelSelect');
    });
  }
});
