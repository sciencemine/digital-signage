import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('configuration-panel', 'Integration | Component | configuration panel', {
  integration: true,
  
  beforeEach: function() {
    this.inject.service('modelService', { as: 'modelService' });
  }
});

test('it renders', function(assert) {
  this.set('callback', (actual) => {
    assert.ok(actual);
  });

  this.render(hbs`{{configuration-panel validationCallback=callback}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ' '), 'Click to hide Turn help on Submit Reset');
});
