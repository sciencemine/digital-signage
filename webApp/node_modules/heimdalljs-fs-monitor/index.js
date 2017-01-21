'use strict';
var fs = require('fs');
var heimdall = require('heimdalljs');
module.exports = FSMonitor;

function FSMonitor() {
  this.state = 'idle';
  this.blacklist = ['createReadStream', 'createWriteStream', 'ReadStream', 'WriteStream'];
}

FSMonitor.prototype.start = function() {
  this.state = 'active';
  this._attach();
};

FSMonitor.prototype.stop = function() {
  this.state = 'idle';
  this._detach();
};

FSMonitor.prototype.shouldMeasure = function() {
  return this.state === 'active';
};

var m = heimdall.registerMonitor('fs', function FSSchema() {

});

function Metric() {
  this.count = 0;
  this.time = 0;
  this.startTime = undefined;
}

Metric.prototype.start = function() {
  this.startTime = process.hrtime();
  this.count++;
};

Metric.prototype.stop = function() {
  var now = process.hrtime();

  this.time += (now[0] - this.startTime[0]) * 1e9 + (now[1] - this.startTime[1]);
  this.startTime = undefined;
};

Metric.prototype.toJSON = function() {
  return {
    count: this.count,
    time: this.time
  };
};

FSMonitor.prototype._measure = function(name, original, context, args) {
  if (this.state !== 'active') {
    throw new Error('Cannot measure if the monitor is not active');
  }

  var metrics = heimdall.statsFor('fs');
  var m = metrics[name] = metrics[name] || new Metric();

  m.start();

  // TODO: handle async
  try {
    return original.apply(context, args);
  } finally {
    m.stop();
  }
};

FSMonitor.prototype._attach = function() {
  var monitor = this;

  for (var member in fs) {
    if (this.blacklist.indexOf(member) === -1) {
      var old = fs[member];
      if (typeof old === 'function') {
        fs[member] = (function(old, member) {
          return function() {
            if (monitor.shouldMeasure()) {
              return monitor._measure(member, old, fs, arguments);
            } else {
              return old.apply(fs, arguments);
            }
          };
        }(old, member));

        fs[member].__restore = function() {
          fs[member] = old;
        };
      }
    }
  }
};

FSMonitor.prototype._detach = function() {
  for (var member in fs) {
    var maybeFunction = fs[member];
    if (typeof maybeFunction === 'function' && typeof maybeFunction.__restore === 'function') {
      maybeFunction.__restore();
    }
  }
};
