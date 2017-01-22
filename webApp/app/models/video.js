import DS from 'ember-data';

export default DS.Model.extend({
  config: DS.attr(),
  items: DS.attr()
});
