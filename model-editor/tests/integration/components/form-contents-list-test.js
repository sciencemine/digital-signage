import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('form-contents-list', 'Integration | Component | form contents list', {
  integration: true
});

test('no data', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{form-contents-list}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ' '), 'No data present.');
});

test('data', function(assert) {

  this.set('arr', [{ name: 'baba', description: 'apples', difficulty: 1, attribute: 'Max'}]);

  this.render(hbs`{{form-contents-list data=arr}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ' '), 'Name: baba Description: ' + 
    'apples Difficulty: 1 Attribute: Max');
});
