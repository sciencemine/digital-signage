
import { isSingleVideo } from 'digital-signage-app-v2/helpers/is-single-video';
import { module, test } from 'qunit';

module('Unit | Helper | is single video');

// Replace this with your real tests.
test('one', function(assert) {
  let result = isSingleVideo([["asht"]]);
  assert.ok(result);
});

test('two', function(assert) {
  let result = isSingleVideo([["asht", "ioen"]]);
  assert.ok(!result);
});
