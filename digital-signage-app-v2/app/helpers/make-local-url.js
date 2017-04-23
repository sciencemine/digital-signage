import Ember from 'ember';

export function makeLocalUrl([arg1, arg2, arg3, arg4]) {
  var temporalLocal = '';

  if (parseInt(arg3) !== 0 && parseInt(arg4) !== 0) {
    temporalLocal = '#t=' + arg3 + ',' + arg4;
  }
  else if (parseInt(arg3) !== 0) {
    temporalLocal = '#t=' + arg3;
  }
  else if (parseInt(arg4) !== 0) {
    temporalLocal = '#t=,' + arg4;
  }

  return arg1 + '/' + arg2 + temporalLocal;
}

export default Ember.Helper.helper(makeLocalUrl);
