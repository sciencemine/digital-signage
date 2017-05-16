import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('model-select-element', 'Integration | Component | model select element', {
  integration: true
});

test('it renders', function(assert) {

  let data = Ember.Object.create({
    "videos": {
        "0": {
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
        "1": {
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
        }
    }
  });

  this.set('vidData', data);

  this.set('baba', (actual) => {
    assert.ok(actual);
  });

  this.render(hbs`{{model-select-element name="baba" description="big boy" modelIdentifier="bigdog" videos=vidData onHoverCallback=(action baba)}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ' '), 'baba big boy');
});