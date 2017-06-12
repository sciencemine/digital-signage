
import { stringAppend } from 'digital-signage-app-v2/helpers/string-append';
import { module, test } from 'qunit';

module('Unit | Helper | string append');

// Replace this with your real tests.
test('no strings', function(assert) {
  let result = stringAppend([]);
  assert.ok(result === "");
});

test('one string', function(assert) {
  let result = stringAppend(["one"]);
  assert.ok(result === "one ");
});

test('two strings', function(assert) {
  let result = stringAppend(["one", "two"]);
  assert.ok(result === "one two ");
});

