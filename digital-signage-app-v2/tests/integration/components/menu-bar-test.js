import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('menu-bar', 'Integration | Component | menu bar', {
  integration: true
});

test('it renders', function(assert) {
	
  let data = Ember.Object.create({
    "ui": {
			"popoverDwell": 3000,
			"popoverShowDelay": 1000
    }   
  });	

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('testData', data);
  
  this.render(hbs`{{menu-bar config=testData}}`);

  assert.equal(this.$().text().trim(), '');
});
