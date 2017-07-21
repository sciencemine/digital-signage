
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('form-contents-input', 'helper:form-contents-input', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {

  this.set('data', Ember.Object.create({
    "displayName": "Exhibit Title",
    "inputType": "text",
    "error": "",
    "validation": {
        "required": "required"
    },
    "help": "Title of the exhibit",
    "data": ""
  }));

  this.render(hbs`{{form-contents-input key="prettyName" class="baba" data=data}}`);

  assert.equal(this.$().text().trim().replace(/\s+/gi, ''), '');
});
