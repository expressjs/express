var utils = require('../utils')
  , debug = require('debug')('express:router:layer')

function Layer(path, options, fn) {
  if (!(this instanceof Layer)) {
    return new Layer(path, options, fn);
  }

  debug('new %s', path);
  options = options || {};
  this.path = path;
  this.params = {};
  this.regexp = utils.pathRegexp(path
    , this.keys = []
    , options.sensitive
    , options.strict
    , options.end);
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
  var keys = this.keys
    , params = this.params = {}
    , m = this.regexp.exec(path)
    , n = 0;

  if (!m) return false;

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];

    try {
      var val = 'string' == typeof m[i]
        ? decodeURIComponent(m[i])
        : m[i];
    } catch(e) {
      var err = new Error("Failed to decode param '" + m[i] + "'");
      err.status = 400;
      throw err;
    }

    if (key) {
      params[key.name] = val;
    } else {
      params[n++] = val;
    }
  }

  return true;
};

module.exports = Layer;
