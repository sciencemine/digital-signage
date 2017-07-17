/**
 * HELPER: make-local-url
 *
 * DESCRIPTION:
 *  combines two parameters to make a local url address
 *
 * PARAMETERS
 *  arg1 - usually modelIdentifier
 *  arg2 - usually fileIdentifier
 *
 * @author Michael Fryer
 * @date 5/11/2017
 */
import Ember from 'ember';

export function makeLocalUrl([arg1, arg2]) {

  return arg1 + '/' + arg2;
}

export default Ember.Helper.helper(makeLocalUrl);
