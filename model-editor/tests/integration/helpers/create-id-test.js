
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('create-id', 'helper:create-id', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('firstVal', '1234');
  this.set('secondVal', '5678');

  this.render(hbs`{{create-id firstVal secondVal}}`);

  assert.equal(this.$().text().trim(), '12345678');
});

