import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('content-area', 'Integration | Component | content area', {
  integration: true,
  
  beforeEach: function() {
    this.inject.service('modelService', { as: 'modelService' });
  }
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{content-area}}`);

  assert.ok(this.$().text().trim().replace(/\s+/gi, ' '));
});
