
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('form-contents-select-glyphicons', 'helper:form-contents-select-glyphicons', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{form-contents-select-glyphicons inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

