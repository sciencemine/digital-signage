
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('newer-version', 'helper:newer-version', {
  integration: true
});

// Replace this with your real tests.
test('no old, no new', function(assert) {
  this.render(hbs`{{newer-version}}`);

  assert.equal(this.$().text().trim(), 'false');
});

test('old, no new', function(assert) {
  this.render(hbs`{{newer-version old=0.1}}`);

  assert.equal(this.$().text().trim(), 'false');
});

test('same version', function(assert) {
  this.render(hbs`{{newer-version old=0.1 new=0.1}}`);

  assert.equal(this.$().text().trim(), 'false');
});

test('new version', function(assert) {
  this.render(hbs`{{newer-version old=0.1 new=0.2}}`);

  assert.equal(this.$().text().trim(), 'true');
});
