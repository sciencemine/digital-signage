
import { isObject } from 'digital-signage-app-v2/helpers/is-object';
import { module, test } from 'qunit';

module('Unit | Helper | is object');

// Replace this with your real tests.
test('empty array', function(assert) {
  let result = isObject([[]]);
  assert.ok(!result);
});

test('array', function(assert) {
  let result = isObject([[42]]);
  assert.ok(!result);
});

test('string', function(assert) {
  let result = isObject(["apple"]);
  assert.ok(!result);
});

test('number', function(assert) {
  let result = isObject([1]);
  assert.ok(!result);
});

test('null', function(assert) {
  let result = isObject([null]);
  assert.ok(!result);
});

test('undefined', function(assert) {
  let result = isObject([undefined]);
  assert.ok(!result);
});

test('bool', function(assert) {
  let result = isObject([true]);
  assert.ok(!result);
});

test('empty object', function(assert) {
  let result = isObject([{}]);
  assert.ok(result);
});

test('object', function(assert) {
  let result = isObject([{ key: "value" }]);
  assert.ok(result);
});

