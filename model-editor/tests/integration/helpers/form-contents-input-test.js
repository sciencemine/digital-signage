
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('form-contents-input', 'helper:form-contents-input', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{form-contents-input inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

