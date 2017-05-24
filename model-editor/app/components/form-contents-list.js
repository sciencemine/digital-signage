/**
  * @pre input of data of the form below
  * data =  [
  *           {
  *             "name": "",
  *             "description": "",
  *             "key": 0,
  *             "difficulty": 0, OPTIONAL
  *             "attribute": "" OPTIONAL
  *           }
  *         ]
  **/
import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    updateModal(key) {
      this.get('updateModalCallback') ("Edit " + this.get('prettyName'), ".attributes.data.attribute", ".attributes", key);
    },
    editRelation(key) {
      this.get('editRelationCallback') (key);
    }
  }
});
