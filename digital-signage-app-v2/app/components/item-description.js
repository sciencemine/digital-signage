import Ember from 'ember';

App.CustomPopoverComponent = Ember.Component.extend({
  classNames: '',
  popoverContentSelector: '',
  didInsertElement: function () {
    var component = this,
        contents = $(component.get('popoverContentSelector'));

    component.$().popover({
      placement: 'auto-right',
      html: true,
      content: contents
    }).on('show.bs.popover', function () {
      contents.removeClass('hide');
    });
  },
  willDestroyElement: function () {
    this.$().popover('destroy');
  }
});