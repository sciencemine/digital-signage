
import { makeStackStyle } from 'digital-signage-app-v2/helpers/make-stack-style';
import { module, test } from 'qunit';

module('Unit | Helper | make stack style');

// Replace this with your real tests.
test('position: 0, 0', function(assert) {
  let result = makeStackStyle([0, 0]);
  assert.ok(result === `{position: absolute; left: 0; top: 0;}`);
});

test('position: 0, -1', function(assert) {
  let result = makeStackStyle([0, -1]);
  assert.ok(result === `{position: absolute; left: 0; top: -1;}`);
});

test('position: -1, 0', function(assert) {
  let result = makeStackStyle([-1, 0]);
  assert.ok(result === `{position: absolute; left: -1; top: 0;}`);
});

test('position: 0.5, 0.5', function(assert) {
  let result = makeStackStyle([0.5, 0.5]);
  assert.ok(result === `{position: absolute; left: 0.5; top: 0.5;}`);
});