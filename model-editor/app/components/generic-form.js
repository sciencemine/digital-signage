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
    }//for

    return inputValid;
  },
  validateTextarea: function() {
    let textareaValid = true;

    for (let i = this.$('textarea').length - 1; i >= 0; i--) {
      let el = this.$('textarea')[i];

      textareaValid = this.validateElement(el) && textareaValid;
    }//for

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
        }//if
        else {
          this.makeSuccess(el);

          selectValid = true && selectValid;
        }//else
      }//if
      else {
        this.makeSuccess(el);

        selectValid = true && selectValid;
      }//else
    }//for

    return selectValid;
  },
  validateElement: function(el) {
      if (el.validity.valid) {
        this.makeSuccess(el);

        return true;
      }//if
      else if (!el.value && !el.validity.valid) {
        this.makeWarning(el);
      }//else if
      else if (!el.validity.valid) {
        this.makeError(el);
      }//else if

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
  getValues: function(data, prefix, clearValues) {
    let payload = { };

    for (let key in data) {
      if (typeof(data[key].data) === 'object' && !Array.isArray(data[key].data)) {
        payload[key] = this.getValues(data[key].data, prefix + "_" + key, clearValues);
      }//if
      else if (Array.isArray(data[key].data)) {
        let el = Ember.$('#' + prefix + "_" + key);
        payload[key] = [ ];

        if (el[0]) {
          if (el[0].multiple) {
            for (var i = 0; i < el.val().length; i++) {
              payload[key].push(el.val()[i]);
            }//for
          }//if
          else if (el[0]) {
            payload[key] = el[0].value;
          }//if
        }//if
      }//else if
      else {
        let el = Ember.$('#' + prefix + "_" + key);
        let value;

        if (el[0]) {
          if (el[0].type === 'checkbox') {
            value = el[0].checked;
            if (clearValues) {
              el[0].checked = false;
            }//if
          }//if
          else if (el[0].type === 'textarea') {
            value = el.val();

            if (clearValues) {
              el[0].value = null;
            }//if
          }//else if
          else if (el[0].type === 'number') {
            value = el[0].valueAsNumber;

            if (clearValues) {
              el[0].value = null;
            }//if
          }//else if
          else {
            value = el[0].value;

            if (clearValues) {
              el[0].value = null;
            }//if
          }//else

          payload[key] = value;
        }//if
      }//else
    }//for

    return payload;
  },
  
  /*****************************************************************************
   * EVENT:
   *  didRender
   *
   * DESCRIPTION:
   *  When the dom renders, turns on tooltips and validate form
   * 
   * AUTHOR:
   *  Michael Fryer
   *
   * DATE:
   *  June 5th, 2017
   ****************************************************************************/
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
      }//if
    }//if

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
    /***************************************************************************
     * ACTION:
     *  submitForm
     *
     * DESCRIPTION:
     *  Callback for submitting a form
     *
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    submitForm() {
      this.get('validationCallback') (this.get('validForm'));

      if (this.get('validForm')) {
        this.get('onSubmitCallback') (this.getValues(this.get('config.data'), this.get('prefix'), this.get('clearValues')), this.get('path'), this.get('key'));
      }//if
      else {
        alert("Please verify the contents of the form before submission");
      }//else

      return false;
    },
    /***************************************************************************
     * ACTION:
     *  validateForm
     *
     * DESCRIPTION:
     *  Validates the form
     *
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    validateForm() {
      (function(component) {
        setTimeout(function() {
          let valid = true;
          valid = component.validateInput() && valid;
          valid = component.validateTextarea() && valid;
          valid = component.validateSelect() && valid;

          component.set('validForm', valid);
        }, 10);
      })(this);
    },
    /***************************************************************************
     * ACTION:
     *  toggleHelp
     *
     * DESCRIPTION:
     *  Toggles the help messages under the inputs on and off
     *
     * AUTHOR:
     *  Michael Fryer
     *
     * DATE:
     *  June 5th, 2017
     **************************************************************************/
    toggleHelp() {
      this.set('showHelp', !this.get('showHelp'));
    }
  }
});
