/*!
 * Connect
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var http = require('http');
var ServerResponse = http.ServerResponse;

// apply only once
if (ServerResponse.prototype._hasConnectPatch) {
  return;
}

// original methods
var setHeader = ServerResponse.prototype.setHeader;

/**
 * Set header `field` to `val`, special-casing
 * the `Set-Cookie` field for multiple support.
 *
 * @param {String} field
 * @param {String} val
 * @api public
 */

ServerResponse.prototype.setHeader = function(field, val){
  var key = field.toLowerCase();

  if ('content-type' == key && this.charset) {
    val += '; charset=' + this.charset;
  }

  return setHeader.call(this, field, val);
};

ServerResponse.prototype._hasConnectPatch = true;
