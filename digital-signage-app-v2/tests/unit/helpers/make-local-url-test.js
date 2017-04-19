
import { makeLocalUrl } from 'digital-signage-app-v2/helpers/make-local-url';
import { module, test } from 'qunit';

module('Unit | Helper | make local url');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = makeLocalUrl(['it', 'works']);
  assert.ok(result === 'it/works');
});

