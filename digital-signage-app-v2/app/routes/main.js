import Ember from 'ember';

export default Ember.Route.extend({
  modelFile: null,

  beforeModel(params) {
    var qp = params.queryParams;

    if (qp.modelfile) {
      this.modelFile = qp.modelfile;
    }
  },
  model() {
    var path = "models/" + (this.modelFile ? this.modelFile : "HealthyStreams") + ".json";
    var data = Ember.$.getJSON(path);

    return data;
  }
});
