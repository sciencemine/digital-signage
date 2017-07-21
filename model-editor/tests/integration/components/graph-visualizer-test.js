import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('graph-visualizer', 'Integration | Component | graph visualizer', {
  integration: true,
  
  beforeEach: function() {
    this.inject.service('modelService', { as: 'modelService' });
  }
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{graph-visualizer}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ' '), 'Exhibit Selection Save Exhibit ' + 
    'Refresh Graph Disable Physics Physics Model Barnes Hut Repulsion Hierarchical Repulsion ' +
    'Force Atlas 2 Based Add Video Attribute Relation Remove Video Relation Edit × Add a Relation ' +
    'Turn help off Submit Reset Hover a video Attributes on this video.');
});
