import { moduleFor, test } from 'ember-qunit';

moduleFor('route:model-select', 'Unit | Route | model select', {
  // Specify the other units that are required for this test.
  needs: ['controller:modelSelect', 'service:modelService', 'service:notify']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
