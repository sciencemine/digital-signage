
import { makeStackStyle } from 'digital-signage-app-v2/helpers/make-stack-style';
import { module, test } from 'qunit';
//import Ember from 'ember';

module('Unit | Helper | make stack style');

// Replace this with your real tests.
test('position: 0, 0', function(assert) {
  let result = makeStackStyle([0, 0]).string === "left: 0%; top: 0%;";
  assert.ok(result);
});

test('position: 0, -1', function(assert) {
  let result = makeStackStyle([0, -50]).string === "left: 0%; top: -50%;";
  assert.ok(result);
});

test('position: -1, 0', function(assert) {
  let result = makeStackStyle([-50, 0]).string === "left: -50%; top: 0%;";
  assert.ok(result);
});

test('position: 0.5, 0.5', function(assert) {
  let result = makeStackStyle([50, 50]).string === "left: 50%; top: 50%;";
  assert.ok(result);
});
