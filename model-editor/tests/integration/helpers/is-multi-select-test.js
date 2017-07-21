
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('is-multi-select', 'helper:is-multi-select', {
  integration: true
});

// Replace this with your real tests.
test('multi-select', function(assert) {
  this.set('inputValue', 'multi-select');

  this.render(hbs`{{is-multi-select inputValue}}`);

  assert.equal(this.$().text().trim(), 'true');
});

test('not-multi-select', function(assert) {
  this.set('inputValue', 'not-multi-select');

  this.render(hbs`{{is-multi-select inputValue}}`);

  assert.equal(this.$().text().trim(), 'false');
});
