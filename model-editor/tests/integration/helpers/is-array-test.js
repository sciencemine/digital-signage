
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('is-array', 'helper:is-array', {
  integration: true
});

// Replace this with your real tests.
test('null', function(assert) {
  this.set('data', null);

  this.render(hbs`{{is-array data}}`);

  assert.equal(this.$().text().trim(), 'false');
});

test('length 0', function(assert) {
  let arr = [ ];
  
  this.set('data', Ember.ArrayProxy.create({ content: arr}));

  this.render(hbs`{{is-array data}}`);

  assert.equal(this.$().text().trim(), 'true');
});

test('length 1', function(assert) {
  let arr = [ "baba" ];
  
  this.set('data', Ember.ArrayProxy.create({ content: arr}));

  this.render(hbs`{{is-array data}}`);

  assert.equal(this.$().text().trim(), 'true');
});

test('length 2', function(assert) {
  let arr = [ "baba", "bobo" ];
  
  this.set('data', Ember.ArrayProxy.create({ content: arr}));

  this.render(hbs`{{is-array data}}`);

  assert.equal(this.$().text().trim(), 'true');
});
