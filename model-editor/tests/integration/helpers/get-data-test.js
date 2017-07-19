
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('get-data', 'helper:get-data', {
  integration: true
});

// Replace this with your real tests.
test('null value', function(assert) {
  let data = Ember.Object.create({
    property: 'value'
  });
  
  this.set('inputData', data);

  this.render(hbs`{{get-data inputData 'nonReal'}}`);

  assert.equal(this.$().text().trim(), '');
});

test('real value', function(assert) {
  let data = Ember.Object.create({
    property: 'value'
  });
  
  this.set('inputData', data);

  this.render(hbs`{{get-data inputData 'property'}}`);

  assert.equal(this.$().text().trim(), 'value');
});

