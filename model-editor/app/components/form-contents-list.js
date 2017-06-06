/*******************************************************************************
 * COMPONENT:
 *  form-contents-list
 *
 * DESCRIPTION:
 *  Creates a list of the items in the data object
 * 
 * PARAMETERS:
 *  data - An array of objects of following form
 *    name - Name of the item
 *    description - Description of the item
 *    difficulty - Difficulty of the item. This is optional
 *    attribute - Attribute of the item. This is optional
 *    
 *
 * AUTHOR:
 *  Michael Fryer
 *
 * DATE:
 *  June 5th, 2017
 ******************************************************************************/
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: ['list-group']
});
