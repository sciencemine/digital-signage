import Ember from 'ember';

export default Ember.Route.extend({
  modelFile: null,

  beforeModel(params) {
    let qp = params.queryParams;

    if (qp.modelfile) {
      this.modelFile = qp.modelfile;
    }
  },
  model() {
    let path = "models/" + (this.modelFile ? this.modelFile : "HealthyStreams") + ".json";
    let blobData = [];


    return Ember.$.getJSON(path).then(res => {
      for (let video in res.videos) {
        let fileIdentifier = res.videos[video].teaser.fileIdentifier;
        let modelIdentifier = res.config.modelIdentifier;

        blobData.push(preloadData(modelIdentifier, fileIdentifier));
      }

      return Ember.RSVP.Promise.all(blobData).then(data => {
        //this is guaranteed in order by loop above
        for (var j = 0;  j < Object.keys(res.videos).length; j++) {
          res.videos[Object.keys(res.videos)[j]].teaser.fileIdentifier = URL.createObjectURL(data[j]);
          res.videos[Object.keys(res.videos)[j]].teaser.isUrl = true;
        }

        return res;
      });
    });
  }
});

/* Creates a promise while a blob is generated */
function preloadData(modelIdentifier, fileIdentifier) {
  return new Ember.RSVP.Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    let url = modelIdentifier + '/' + fileIdentifier;

    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onreadystatechange = handler;
    xhr.send();

    function handler() {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          resolve(this.response);
        }
        else {
          reject('preloadData: `' + url + '` failed with status: [' + this.status + ']');
        }
      }
    }
  });
}