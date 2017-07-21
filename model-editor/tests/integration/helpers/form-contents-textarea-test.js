
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('form-contents-textarea', 'helper:form-contents-textarea', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  let data = {
    help: 'help message',
    validataion: {
      required: 'required'
    },
    error: 'This is required'
  };
  
  this.set('inputValue', data);

  this.render(hbs`{{form-contents-textarea
    key=0
    class="baba"
    placeholder="placeholder"
    value="HAHA"
    data=inputValue
  }}`);

  assert.equal(this.$().text().trim(), 'HAHA');
});

test('it renders', function(assert) {
  let data = {
    help: 'help message',
    validataion: {
      required: 'required'
    },
    error: 'This is required'
  };
  
  this.set('inputValue', data);

  this.render(hbs`{{form-contents-textarea
    key=0
    class="baba"
    placeholder="placeholder"
    data=inputValue
  }}`);

  assert.equal(this.$().text().trim(), '');
});

