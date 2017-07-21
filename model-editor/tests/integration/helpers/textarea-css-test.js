
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('textarea-css', 'helper:textarea-css', {
  integration: true
});

// Replace this with your real tests.
test('true', function(assert) {
  this.set('inputValue', true);

  this.render(hbs`{{textarea-css inputValue}}`);

  assert.equal(this.$().text().trim(), 'form-control input-sm resize-horizontal');
});

test('false', function(assert) {
  this.set('inputValue', false);

  this.render(hbs`{{textarea-css inputValue}}`);

  assert.equal(this.$().text().trim(), 'form-control input-sm resize-vertical');
});

