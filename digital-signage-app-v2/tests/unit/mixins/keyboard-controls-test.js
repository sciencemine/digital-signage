import Ember from 'ember';
import KeyboardControlsMixin from 'digital-signage-app-v2/mixins/keyboard-controls';
import { module, test } from 'qunit';

module('Unit | Mixin | keyboard controls');

// Replace this with your real tests.
test('it works', function(assert) {
  let KeyboardControlsObject = Ember.Object.extend(KeyboardControlsMixin);
  let subject = KeyboardControlsObject.create();
  assert.ok(subject);
});
