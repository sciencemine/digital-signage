import { moduleFor, test } from 'ember-qunit';

moduleFor('route:model-edit', 'Unit | Route | model edit', {
  // Specify the other units that are required for this test.
  needs: ['service:visData', 'service:modelService', 'service:notify']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
