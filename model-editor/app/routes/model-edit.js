import Ember from 'ember';

export default Ember.Route.extend({
  modelfile: "ModelSkeleton",

  beforeModel(params) {
    let qp = params.queryParams;

    if (qp.modelfile) {
      this.modelfile = qp.modelfile;
    }
  },
  model() {
    let path = "models/" + this.modelfile + ".json";

    return Ember.$.getJSON(path);
  }
});
