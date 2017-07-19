
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('is-valid-input-type', 'helper:is-valid-input-type', {
  integration: true
});

// Replace this with your real tests.
test('text', function(assert) {
  this.set('inputValue', 'text');

  this.render(hbs`{{is-valid-input-type inputValue}}`);

  assert.equal(this.$().text().trim(), 'true');
});

test('dropdown', function(assert) {
  this.set('inputValue', 'dropdown');

  this.render(hbs`{{is-valid-input-type inputValue}}`);

  assert.equal(this.$().text().trim(), 'true');
});

test('number', function(assert) {
  this.set('inputValue', 'number');

  this.render(hbs`{{is-valid-input-type inputValue}}`);

  assert.equal(this.$().text().trim(), 'true');
});

test('checkbox', function(assert) {
  this.set('inputValue', 'checkbox');

  this.render(hbs`{{is-valid-input-type inputValue}}`);

  assert.equal(this.$().text().trim(), 'true');
});

test('other', function(assert) {
  this.set('inputValue', 'other');

  this.render(hbs`{{is-valid-input-type inputValue}}`);

  assert.equal(this.$().text().trim(), 'false');
});

