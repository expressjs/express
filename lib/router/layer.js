/**
 * Module dependencies.
 */

var pathRegexp = require('path-to-regexp');
var debug = require('debug')('express:router:layer');

/**
 * Expose `Layer`.
 */

module.exports = Layer;

function Layer(path, options, fn) {
  if (!(this instanceof Layer)) {
    return new Layer(path, options, fn);
  }

  debug('new %s', path);
  options = options || {};
  this.regexp = pathRegexp(path, this.keys = [], options);
  this.handle = fn;
}

/**
 * Check if this route matches `path`, if so
 * populate `.params`.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

Layer.prototype.match = function(path){
  var keys = this.keys;
  var params = this.params = {};
  var m = this.regexp.exec(path);
  var n = 0;
  var key;
  var val;

  if (!m) return false;

  this.path = m[0];

  for (var i = 1, len = m.length; i < len; ++i) {
    key = keys[i - 1];
    val = decode_param(m[i]);

    if (key) {
      params[key.name] = val;
    } else {
      params[n++] = val;
    }
  }

  return true;
};

/**
 * Decode param value.
 *
 * @param {string} val
 * @return {string}
 * @api private
 */

function decode_param(val){
  if (typeof val !== 'string') {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (e) {
    var err = new TypeError("Failed to decode param '" + val + "'");
    err.status = 400;
    throw err;
  }
}
