
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('is-glyphicons', 'helper:is-glyphicons', {
  integration: true
});

// Replace this with your real tests.
test('glyphicons', function(assert) {
  this.set('inputValue', 'glyphicons');

  this.render(hbs`{{is-glyphicons inputValue}}`);

  assert.equal(this.$().text().trim(), 'true');
});

test('not-glyphicons', function(assert) {
  this.set('inputValue', 'not-glyphicons');

  this.render(hbs`{{is-glyphicons inputValue}}`);

  assert.equal(this.$().text().trim(), 'false');
});

