import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('stack-list', 'Integration | Component | stack list', {
  integration: true
});

test('it renders', function(assert) {
  let data = Ember.Object.create({
    "0": {
      "prettyName": "Rubber Band",
      "description": "Rubber bands are fun but they can be treacherous and have been known to turn on even the best rubber banders when they detect weakness.",
      "x": 50,
      "y": 50,
      "videos": [
        {
          "prettyName": "Kenny with a Rubber Band: Episode X-II - A New Hope",
          "description": "Kenny shoots a rubber band... You won't believe what happens next!",
          "attributes": [ "0", "6" ],
          "relations": [
            {
              "relatedId": "1",
              "difficulty": 1,
              "attributeId": "0"
            }
          ],
          "full": {
            "fileIdentifier": "kenny_band_1.mp4",
            "isUrl": false,
            "attribution": "Kenny"
          },
          "teaser": {
            "fileIdentifier": "kenny_band_1.mp4",
            "isUrl": false,
            "attribution": "Kenny"
          }
        },
        {
          "prettyName": "Kenny with a Rubber Band: Episode IIII - Return of the New Hope",
          "description": "The phantom menace strikes back at the return of the revenge of the clones.",
          "attributes": [ "0", "6" ],
          "relations": [
            {
              "relatedId": "0",
              "difficulty": -1,
              "attributeId": "0"
            }
          ],
          "full": {
            "fileIdentifier": "kenny_band_2.mp4",
            "isUrl": false,
            "attribution": "Kenny"
          },
          "teaser": {
            "fileIdentifier": "kenny_band_2.mp4",
            "isUrl": false,
            "attribution": "Kenny"
          }
        }
      ]
    },
    "1": {
      "prettyName": "Promark 747B",
      "description": "Promark Neil Peart Signature 747Bs are the ONLY way to play.",
      "x": 80,
      "y": 80,
      "videos": [
        {
          "prettyName": "Kenny with a Rubber Band: Episode X-II - A New Hope",
          "description": "Kenny shoots a rubber band... You won't believe what happens next!",
          "attributes": [ "0", "6" ],
          "relations": [
            {
              "relatedId": "1",
              "difficulty": 1,
              "attributeId": "0"
            }
          ],
          "full": {
            "fileIdentifier": "kenny_band_1.mp4",
            "isUrl": false,
            "attribution": "Kenny"
          },
          "teaser": {
            "fileIdentifier": "kenny_band_1.mp4",
            "isUrl": false,
            "attribution": "Kenny"
          }
        }
      ]
    }
  });
  
  this.set('baba', (actual) => {
    assert.ok(actual);
  });
  
  this.set('testData', data);

  this.render(hbs`{{stack-list data=testData modelIdentifier='' selectedCallback=(action baba)}}`);

  assert.equal(this.$().text().trim(), '');
});
