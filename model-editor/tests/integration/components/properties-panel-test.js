import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('properties-panel', 'Integration | Component | properties panel', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{properties-panel}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ' '), 'Properties Scroll meClick to hide No video selected. Select a video from the middle of the screen to see information about it.');
});
