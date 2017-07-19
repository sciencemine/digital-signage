import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:model-select', 'Unit | Controller | model select', {
  // Specify the other units that are required for this test.
  needs: ['service:notify', 'service:modelService']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
