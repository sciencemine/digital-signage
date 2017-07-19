import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('attribute-list-item', 'Integration | Component | attribute list item', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{attribute-list-item}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ' '), 'No description available Edit Remove');
});
