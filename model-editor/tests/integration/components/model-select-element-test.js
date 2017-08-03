import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('model-select-element', 'Integration | Component | model select element', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{model-select-element}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ' '), 'Update to new version');
});
