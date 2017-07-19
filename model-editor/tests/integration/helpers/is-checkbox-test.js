
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('is-checkbox', 'helper:is-checkbox', {
  integration: true
});

// Replace this with your real tests.
test('checkbox', function(assert) {
  this.set('inputValue', 'checkbox');

  this.render(hbs`{{is-checkbox inputValue}}`);

  assert.equal(this.$().text().trim(), 'true');
});

test('not-checkbox', function(assert) {
  this.set('inputValue', 'not-checkbox');

  this.render(hbs`{{is-checkbox inputValue}}`);

  assert.equal(this.$().text().trim(), 'false');
});

