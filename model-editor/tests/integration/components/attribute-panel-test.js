import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('attribute-panel', 'Integration | Component | attribute panel', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{attribute-panel}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ' '), 'Attributes Scroll me List of attributes in the exhibit. Drag an attribute onto a video to add it or select "Add Attribute" at the bottom to create a new attribute. Add Attribute');
});
