import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('video-stack', 'Integration | Component | video stack', {
  integration: true
});

test('it renders', function(assert) {
 let data = Ember.Object.create({
    "videos": [
        {
            "prettyName": "Kenny with a Rubber Band: Episode X-II - A New Hope",
            "description": "Kenny shoots a rubber band... You won't believe what happens next!",
            "attributes": [ "0", "6" ],
            "full": {
                "fileIdentifier": "kenny_band_1.mp4",
                "isUrl": false
            },
            "teaser": {
                "fileIdentifier": "kenny_band_1.mp4",
                "isUrl": false
            }
        },
        {
            "prettyName": "Kenny with a Rubber Band: Episode IIII - Return of the New Hope",
            "description": "The phantom menace strikes back at the return of the revenge of the clones.",
            "attributes": [ "0", "6" ],
            "full": {
                "fileIdentifier": "kenny_band_2.mp4",
                "isUrl": false
            },
            "teaser": {
                "fileIdentifier": "kenny_band_2.mp4",
                "isUrl": false
            }
        },
        {
            "prettyName": "3 flappy 5 me",
            "description": "Our hero is sitting in the museum lab one day when Michael decides he needs a video to test stuff. The story unfolds as Kenny decides to make a video based on the lost footage from Josh.",
            "attributes": [ "5", "6" ],
            "full": {
                "fileIdentifier": "kenny_flap.mp4",
                "isUrl": false
            },
            "teaser": {
                "fileIdentifier": "kenny_flap.mp4",
                "isUrl": false
            }
        },
        {
            "prettyName": "Kenny: Sticks - Electric Boogaloo",
            "description": "Ever wonder what would happen when a talentless nerd decides to begin a career in air-drumming? Find out in this zany action adventure horror comedy drama starring Kendall Schmit as Kenny, the hapless air-drummer wannabe as his loyal friends and family help him on his tough road to stardom.",
            "attributes": [ "1", "3", "4", "6" ],
            "full": {
                "fileIdentifier": "kenny_sticks.mp4",
                "isUrl": false
            },
            "teaser": {
                "fileIdentifier": "kenny_sticks.mp4",
                "isUrl": false
            }
        }
    ]
});
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('testData', data);
  this.render(hbs`{{video-stack videos=testData}}`);

  assert.equal(this.$().text().trim(), '');
});
