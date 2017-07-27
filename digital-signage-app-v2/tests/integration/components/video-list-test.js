import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const modelDataStub = Ember.Service.extend({
    _data: null,
  
  beforeEach() {
    this.register('service:model-data', modelDataStub);
    this.inject.service('model-data', { as: 'modelData' });
  }
});

moduleForComponent('video-list', 'Integration | Component | video list', {
  integration: true
});

test('it renders', function(assert) {
  let data = Ember.Object.create([ "apple" ]);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('testData', data);

  this.set('baba', (actual) => {
    assert.ok(actual);
  });

  this.render(hbs`{{video-list videos=testData modelIdentifier='' selectedCallback=(action baba)}}`);

  assert.equal(this.$().text().trim(), '');

  this.render(hbs`{{#video-list videos=testData modelIdentifier='' selectedCallback=(action baba)}}
    template block text
    {{/video-list}}`);

  assert.equal(this.$().text().trim(), 'template block text');
});
