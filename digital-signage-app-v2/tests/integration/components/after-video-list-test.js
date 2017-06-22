import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('after-video-list', 'Integration | Component | after video list', {
  integration: true
});

test('it renders', function(assert) {
  let testData = Ember.Object.create(
    [
      {
        prettyName: "History",
        description: "",
        x: 0,
        y: 0,
        videos: [
          {
            prettyName: "ioenasihoetna",
            description: "oansionasnt",
            attributes: [ ],
            relations: [
              {
                relatedId: "",
                difficulty: 1,
                attributeId: ""
              }
            ],
            full: {
              fileIdentifier: "kenny_band_1.mp4",
              isUrl: false,
              attribution: ""
            },
            teaser: {
              fileIdentifier: "kenny_band_1.mp4",
              isUrl: false,
              attribution: ""
            }
          },
          {
            prettyName: "ioenasihoetna",
            description: "oansionasnt",
            attributes: [ ],
            relations: [
              {
                relatedId: "",
                difficulty: 1,
                attributeId: ""
              }
            ],
            full: {
              fileIdentifier: "kenny_band_1.mp4",
              isUrl: false,
              attribution: ""
            },
            teaser: {
              fileIdentifier: "kenny_band_1.mp4",
              isUrl: false,
              attribution: ""
            }
          }
        ]
      }
    ]
  );
  
  this.set('data', testData);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{after-video-list data=data}}`);

  assert.equal(this.$().text().trim(), '');
});
