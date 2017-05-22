
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('get-display-name', 'helper:get-display-name', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  let data = Ember.Object.create({
    baba: {
      displayName: "bobo"
    }
  });

  this.set('obj', data);

  this.render(hbs`{{get-display-name obj "baba"}}`);

  assert.equal(this.$().text().trim(), 'bobo');
});

