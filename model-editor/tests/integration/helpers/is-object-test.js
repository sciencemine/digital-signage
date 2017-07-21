
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('is-object', 'helper:is-object', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('data', Ember.Object.create({ "baba": "bobo" }));

  this.render(hbs`{{is-object data}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ''), 'true');
});

test('it renders', function(assert) {
  this.set('data', { "baba": "bobo" });

  this.render(hbs`{{is-object data}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ''), 'true');
});

test('it renders', function(assert) {
  this.set('data', Ember.A([ "baba", "bobo" ]));

  this.render(hbs`{{is-object data}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ''), 'false');
});

test('it renders', function(assert) {
  this.set('data', [ "baba", "bobo" ]);

  this.render(hbs`{{is-object data}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ''), 'false');
});
