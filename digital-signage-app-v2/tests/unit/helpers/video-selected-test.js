
import { videoSelected } from 'digital-signage-app-v2/helpers/video-selected';
import { module, test } from 'qunit';

module('Unit | Helper | video selected');

// Replace this with your real tests.
test('asht asht', function(assert) {
  let result = videoSelected(["asht", "asht"]);
  assert.ok(result);
});

test('asht ashti', function(assert) {
  let result = videoSelected(["asht", "ashti"]);
  assert.ok(!result);
});

test('ashti asht', function(assert) {
  let result = videoSelected(["ashti", "asht"]);
  assert.ok(!result);
});

test('1 1', function(assert) {
  let result = videoSelected([1, 1]);
  assert.ok(result);
});

test('1 0', function(assert) {
  let result = videoSelected([1, 0]);
  assert.ok(!result);
});

test('0 1', function(assert) {
  let result = videoSelected([0, 1]);
  assert.ok(!result);
});
