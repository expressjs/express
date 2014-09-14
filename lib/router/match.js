
/**
 * Expose `Layer`.
 */

module.exports = Match;

function Match(layer, path, params) {
  this.layer = layer;
  this.params = {};
  this.path = path || '';

  if (!params) {
    return this;
  }

  var keys = layer.keys;
  var n = 0;
  var prop;
  var key;
  var val;

  for (var i = 0; i < params.length; i++) {
    key = keys[i];
    val = decode_param(params[i]);
    prop = key
      ? key.name
      : n++;

    this.params[prop] = val;
  }

  return this;
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
