
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('is-array', 'helper:is-array', {
  integration: true
});

// Replace this with your real tests.
test('length 2', function(assert) {
  let arr = [ "baba", "bobo" ];
  this.set('data', Ember.ArrayProxy.create({ content: Ember.A(arr)}));

  this.render(hbs`{{is-array data}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ''), 'false');
});
