import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('video-list', 'Integration | Component | video list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{video-list}}`);

  assert.equal(this.$().text().trim(), 'This is a video list\nIs Active:');

  // Template block usage:
  this.render(hbs`
    {{#video-list}}
      template block text
    {{/video-list}}
  `);

  assert.equal(this.$().text().trim(), 'This is a video list\nIs Active: \n      template block text');
});
