
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('form-contents-select-glyphicons', 'helper:form-contents-select-glyphicons', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('data', Ember.Object.create([ "baba", "bobo" ]));

  this.render(hbs`{{form-contents-select-glyphicons data=data key="hehe" class="myClass"}}`);

  assert.equal(this.$().text().trim(), '');
});

