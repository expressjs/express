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
var writeHead = ServerResponse.prototype.writeHead;

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

ServerResponse.prototype.writeHead = function(statusCode, reasonPhrase, headers){
  if (typeof reasonPhrase === 'object') headers = reasonPhrase;
  if (typeof headers === 'object') {
    Object.keys(headers).forEach(function(key){
      this.setHeader(key, headers[key]);
    }, this);
  }
  if (!this._emittedHeader) this.emit('header');
  this._emittedHeader = true;
  return writeHead.call(this, statusCode, reasonPhrase);
};

ServerResponse.prototype._hasConnectPatch = true;
