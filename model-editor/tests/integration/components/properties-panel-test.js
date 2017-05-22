import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('properties-panel', 'Integration | Component | properties panel', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{properties-panel}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ' '), 'Properties Scroll me List of properties the video has. Submit Submit at bottom of scroll');
});
