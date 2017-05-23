
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('is-valid-input-type', 'helper:is-valid-input-type', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{is-valid-input-type inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

