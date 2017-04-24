
import { makeLocalUrl } from 'digital-signage-app-v2/helpers/make-local-url';
import { module, test } from 'qunit';

module('Unit | Helper | make local url');

// Replace this with your real tests.
test('it works 0 0', function(assert) {
  let result = makeLocalUrl(['it', 'works', '0', '0']);
  assert.ok(result === 'it/works');
});


test('it works 0 1', function(assert) {
  let result = makeLocalUrl(['it', 'works', '0', '1']);
  assert.ok(result === 'it/works#t=,1');
});


test('it works 1 0', function(assert) {
  let result = makeLocalUrl(['it', 'works', '1', '0']);
  assert.ok(result === 'it/works#t=1');
});


test('it works 1 2', function(assert) {
  let result = makeLocalUrl(['it', 'works', '1', '2']);
  assert.ok(result === 'it/works#t=1,2');
});

