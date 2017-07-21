
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('is-list', 'helper:is-list', {
  integration: true
});

// Replace this with your real tests.
test('list', function(assert) {
  this.set('inputValue', 'list');

  this.render(hbs`{{is-list inputValue}}`);

  assert.equal(this.$().text().trim(), 'true');
});

test('not-list', function(assert) {
  this.set('inputValue', 'not-list');

  this.render(hbs`{{is-list inputValue}}`);

  assert.equal(this.$().text().trim(), 'false');
});
