
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('is-textarea', 'helper:is-textarea', {
  integration: true
});

// Replace this with your real tests.
test('textarea', function(assert) {
  this.set('inputValue', 'textarea');

  this.render(hbs`{{is-textarea inputValue}}`);

  assert.equal(this.$().text().trim(), 'true');
});

test('not-textarea', function(assert) {
  this.set('inputValue', 'not-textarea');

  this.render(hbs`{{is-textarea inputValue}}`);

  assert.equal(this.$().text().trim(), 'false');
});

