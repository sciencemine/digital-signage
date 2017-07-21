import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('attribute-panel', 'Integration | Component | attribute panel', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{attribute-panel}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ' '), 'Attributes Scroll meClick to hide List of attributes in the exhibit. Drag an attribute onto a video to add it or select the "Add Attribute" button to the right to add a new one. Click icons to navigate to specific attributes');
});
