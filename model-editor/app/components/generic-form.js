/*******************************************************************************
 * COMPONENT:
 *  generic-form
 *
 * DESCRIPTION:
 *  Contents of a form
 * 
 * PARAMETERS:
 *  validationCallback - Callback for where the validation result should go
 *  onSubmitCallback - Callback for form submission
 *  prefix - Prefix for the form. For unique identification of form inputs
 *  path - Path to the object model where the data is to be submitted
 *  key - Key in the object the path points to
 *  showHelp - If the form is to show help messages or not
 *  showList - If the form is to show lists or not
 *  isInline - If the form is inline, otherwise horizontal
 *  clearValues - If the form should clear values when it is submitted or not
 *  showTitle - If the form should show the title or not
 *  showTooptips - if the form should show tooltips or not
 *  data - The data to populate the form with
 *  config - The configuration object for the form
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

export default Ember.Component.extend({
  notify: Ember.inject.service(),
  
  isInline: false,
  showTitle: true,
  showTooltips: false,
  showHelp: false,
  showList: false,
  validForm: false,
  clearValues: false,
  path: "",
  prefix: "",
  key: "",

  validateInput: function() {
    let inputValid = true;

    for (let i = this.$('input').length - 1; i >= 0; i--) {
      let el = this.$('input')[i];

      inputValid = this.validateElement(el) && inputValid;
    }

    return inputValid;
  },
  validateTextarea: function() {
    let textareaValid = true;

    for (let i = this.$('textarea').length - 1; i >= 0; i--) {
      let el = this.$('textarea')[i];

      textareaValid = this.validateElement(el) && textareaValid;
    }

    return textareaValid;
  },
  validateSelect: function() {
    let selectValid = true;

    for (let i = this.$('select').length - 1; i >= 0; i--) {
      let el = this.$('select')[i];
      let glyphicon = this.$('#' + el.id + "_span");
      
      glyphicon.attr("class", "glyphicon form-control-feedback " + el.value);

      if (el.multiple && this.$("#" + el.id).val()) {
        if (this.$("#" + el.id).val().length === 0) {
          this.makeWarning(el);

          selectValid = false && selectValid;
        }
        else {
          this.makeSuccess(el);

          selectValid = true && selectValid;
        }
      }
      else {
        this.makeSuccess(el);

        selectValid = true && selectValid;
      }
    }

    return selectValid;
  },
  validateElement: function(el) {
      if (el.validity.valid) {
        this.makeSuccess(el);

        return true;
      }
      else if (!el.value && !el.validity.valid) {
        this.makeWarning(el);
      }
      else if (!el.validity.valid) {
        this.makeError(el);
      }

      return false;
  },
  makeSuccess(el) {
    this.$('#' + el.id + '_div').removeClass("has-warning has-error").addClass("has-success");
    this.$('#' + el.id + '_span').removeClass("glyphicon-warning-sign glyphicon-remove").addClass("glyphicon-ok");
  },
  makeWarning(el) {
    this.$('#' + el.id + '_div').removeClass("has-error has-success").addClass("has-warning");
    this.$('#' + el.id + '_span').removeClass("glyphicon-remove glyphicon-ok").addClass("glyphicon-warning-sign");
  },
  makeError(el) {
    this.$('#' + el.id + '_div').removeClass("has-warning has-success").addClass("has-error");
    this.$('#' + el.id + '_span').removeClass("glyphicon-warning-sign glyphicon-ok").addClass("glyphicon-remove");
  },
  getValues: function(data, prefix) {
    let payload = { };

    for (let key in data) {
      if (typeof(data[key].data) === 'object' && !Array.isArray(data[key].data)) {
        payload[key] = this.getValues(data[key].data, prefix + "_" + key);
      }
      else if (Array.isArray(data[key].data)) {
        let el = Ember.$('#' + prefix + "_" + key);
        payload[key] = [ ];

        if (el[0]) {
          if (el[0].multiple) {
            for (var i = 0; i < el.val().length; i++) {
              payload[key].push(el.val()[i]);
            }
          }
          else if (el[0]) {
            payload[key] = el[0].value;
          }
        }
      }
      else {
        let el = Ember.$('#' + prefix + "_" + key);
        let value;

        if (el[0]) {
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
    }

    return payload;
  },
  didRender() {
    if (this.get('showTooltips')) {
      if (this.$('[data-toggle="tooltip"]')) {
        this.$('[data-toggle="tooltip"]').tooltip({
          trigger: "focus",
          delay: {
            show: 250,
            hide: 100
          },
          html: true
        });
      }
    }

    this.send('validateForm');
    this.get('validationCallback') (this.get('validForm'));
  },
  didUpdateAttrs() {
    if (this.get('data')) {
      this.notifyPropertyChange('data');
      this.rerender();
    }
  },
  actions: {
    submitForm() {
      let validForm = this.get('validForm');
      
      this.get('validationCallback') (validForm);

      if (validForm) {
        let prefix = this.get('prefix');
        
        this.get('onSubmitCallback') (this.getValues(this.get('config.data'), prefix), this.get('path'), this.get('key'));
      
        this.get('notify').success("Form successfully submitted!", {
          radius: true,
          closeAfter: 10 * 1000
        });
        
        this.$('#' + prefix + "_form")[0].reset();
      }
      else {
        this.get('notify').alert("Please verify the contents of the form before submission.", {
          radius: true,
          closeAfter: 10 * 1000
        });
      }

      return false;
    },
    validateForm() {
      let valid = true;
      
      valid = this.validateInput() && valid;
      valid = this.validateTextarea() && valid;
      valid = this.validateSelect() && valid;

      this.set('validForm', valid);
    },
    toggleHelp() {
      this.toggleProperty('showHelp');
    }
  }
});
