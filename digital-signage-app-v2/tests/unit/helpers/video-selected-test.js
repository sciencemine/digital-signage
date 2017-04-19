
import { videoSelected } from 'digital-signage-app-v2/helpers/video-selected';
import { module, test } from 'qunit';

module('Unit | Helper | video selected');

// Replace this with your real tests.
test('0 0', function(assert) {
  let result = videoSelected([0, 0]);
  assert.ok(result);
});

test('0 false', function(assert) {
  let result = videoSelected([0, false]);
  assert.ok(!result);
});

test('0 1', function(assert) {
  let result = videoSelected([0, 1]);
  assert.ok(!result);
});

test('0 -1', function(assert) {
  let result = videoSelected([0, -1]);
  assert.ok(!result);
});

test('false false', function(assert) {
  let result = videoSelected([false, false]);
  assert.ok(!result);
});

test('0 true', function(assert) {
  let result = videoSelected([0, true]);
  assert.ok(!result);
});
