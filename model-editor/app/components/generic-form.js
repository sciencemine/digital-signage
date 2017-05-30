import Ember from 'ember';

export default Ember.Component.extend({
  noLabel: true,
  isInline: false,
  showTitle: true,
  showTooltips: false,
  showHelp: false,
  showList: false,
  validForm: false,
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

    this.send('validateForm');
    this.get('validation') (this.get('validForm'))
  },
  actions: {
    submitForm() {
      this.get('onSubmitCallback') (getValues(this.get('config.data'), this.get('prefix')), this.get('path'), this.get('key'));

      return false;
    },
    validateForm() {
      this.set('validForm', true);

      this.send('validateInput');
      this.send('validateTextarea');
    },
    validateInput() {
      for (var i = this.$('input').length - 1; i >= 0; i--) {
        let el = this.$('input')[i];

        this.send('validate', el);
      }
    },
    validateTextarea() {
      for (var i = this.$('textarea').length - 1; i >= 0; i--) {
        let el = this.$('textarea')[i];

        this.send('validate', el);
      }
    },
    validate(el) {
      if (el.validity.valid) {
        this.$('#' + el.id + '_div').removeClass("has-warning has-error").addClass("has-success");
        this.$('#' + el.id + '_span').removeClass("glyphicon-warning-sign glyphicon-remove").addClass("glyphicon-ok");

        this.set('validForm', this.get('validForm') && true);
      }
      else if (!el.value && !el.validity.valid) {
        this.$('#' + el.id + '_div').removeClass("has-error has-success").addClass("has-warning");
        this.$('#' + el.id + '_span').removeClass("glyphicon-remove glyphicon-ok").addClass("glyphicon-warning-sign");

        this.set('validForm', this.get('validForm') && false);
      }
      else if (!el.validity.valid) {
        this.$('#' + el.id + '_div').removeClass("has-warning has-success").addClass("has-error");
        this.$('#' + el.id + '_span').removeClass("glyphicon-warning-sign glyphicon-ok").addClass("glyphicon-remove");

        this.set('validForm', this.get('validForm') && false);
      }
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
      payload[key] = getValues(data[key].data, prefix + "_" + key);
    }
    else if (Array.isArray(data[key].data)) {
      payload[key] = [ ];
    }
    else {
      let el = Ember.$('#' + prefix + "_" + key);
      let value;

      if (el[0].type === 'checkbox') {
        value = el[0].checked;
      }
      else if (el[0].type === 'textarea') {
        value = el.val();
      }
      else if (el[0].type === 'number') {
        value = el[0].valueAsNumber;
      }
      else {
        value = el[0].value;
      }

      payload[key] = value;
    }
  }

  return payload;
}
