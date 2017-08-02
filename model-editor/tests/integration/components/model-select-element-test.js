import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('model-select-element', 'Integration | Component | model select element', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{model-select-element}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ''), 'Update');
});
