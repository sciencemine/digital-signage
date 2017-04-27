
import { selectedStyle } from 'digital-signage-app-v2/helpers/selected-style';
import { module, test } from 'qunit';

module('Unit | Helper | selected style');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = selectedStyle(['it', 'works']);
  assert.ok(result === 'it works');
});


test('baba bobo', function(assert) {
  let result = selectedStyle(['baba', 'bobo']);
  assert.ok(result === 'baba bobo');
});