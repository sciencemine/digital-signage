import Ember from 'ember';

export default Ember.Route.extend({
  modelData: Ember.inject.service(),
  
  modelFile: null,
  
  preloadData: function(modelIdentifier, fileIdentifier) {
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
  },
  beforeModel(params) {
    let qp = params.queryParams;

    if (qp.modelfile) {
      this.modelFile = qp.modelfile;
    }
    else {
      this.replaceWith('modelSelect');
    }
  },
  model() {
    /**
     *  blobDaba for promises returned is array as cannot `Promise.all` on a hash
     *  uniqueVids for unique vids blobData and uniqueVids are 1-1 as a promise
     *   is returned and it is not waiting to be resolved first
     */
    let path = "models/" + (this.modelFile ? this.modelFile : "HealthyStreams") + ".json";
    let route = this;
    let uniqueVids = {
      vids: [],
      blobData: []
    };

    return Ember.$.getJSON(path).then((res) => {
      let modelIdentifier = res.config.modelIdentifier;

      //gets all unique videos and makes blobs of them
      for (let video in res.videos) {
        if (!(res.videos[video].teaser.fileIdentifier in uniqueVids) && !res.videos[video].teaser.isUrl) {
          uniqueVids.vids.push(res.videos[video].teaser.fileIdentifier);
          uniqueVids[res.videos[video].teaser.fileIdentifier] = null;
          uniqueVids.blobData.push(route.preloadData(modelIdentifier, res.videos[video].teaser.fileIdentifier));
        }
      }

      //after promises on blobs has been resolved
      return Ember.RSVP.Promise.all(uniqueVids.blobData).then((data) => {
        //make url of the blob and hash the uniqueVid to the url
        for (var i = 0;  i < uniqueVids.vids.length; i++) {
          uniqueVids[uniqueVids.vids[i]] = URL.createObjectURL(data[i]);
        }

        //update fileIdentifier in model to be the blob for all videos
        for (let video in res.videos) {
          if (!res.videos[video].teaser.isUrl) {
            res.videos[video].teaser.fileIdentifier = uniqueVids[res.videos[video].teaser.fileIdentifier];
            res.videos[video].teaser.isUrl = true;
          }
        }
        
        return route.get('modelData').load(res);
      });
    }).fail(() => {
      route.transitionTo('modelSelect');
    });
  }
});
