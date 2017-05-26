import Ember from 'ember';

export default Ember.Component.extend({
  noLabel: true,
  isInline: false,
  showTitle: true,
  showTooltips: false,
  showHelp: false,
  showList: false,
  path: "",
  prefix: "",
  key: "",

  didRender() {
    if (this.get('showTooltips')) {
      if (this.$('[data-toggle="tooltip"]')) {
        this.$('[data-toggle="tooltip"]').tooltip({
          trigger: "focus",
          delay: {
            show: 250,
            hide: 100
          }
        });
      }
    }
  },
  actions: {
    submitForm() {
      this.get('onSubmitCallback') (getValues(this.get('config.data'), this.get('prefix')), this.get('path'), this.get('key'));

      return false;
    },
    toggleHelp() {
      this.set('showHelp', !this.get('showHelp'));
    }
  }
});

function getValues(data, prefix) {
  let payload = { };

  for (var key in data) {
    if (typeof(data[key].data) === 'object' && !Array.isArray(data[key].data)) {
      payload[key] = getValues(data[key].data, prefix + key);
    }
    else if (Array.isArray(data[key].data)) {
      payload[key] = [ ];
    }
    else {
      let el = Ember.$('#' + prefix + key);
      let value;

      if (el[0].type === 'checkbox') {
        value = el[0].checked;
      }
      else if (el[0].type === 'textarea') {
        value = el.val();
      }
      else {
        value = el[0].value;
      }

      payload[key] = value;
    }
  }

  return payload;
}
