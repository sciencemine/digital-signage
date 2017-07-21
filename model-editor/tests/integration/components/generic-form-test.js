import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('generic-form', 'Integration | Component | generic form', {
  integration: true
});

test('it renders', function(assert) {
  this.set('callback', (actual) => {
    assert.ok(actual);
  });

  this.render(hbs`{{generic-form validationCallback=callback}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ' '), 'Turn help on Submit Reset');
});
