/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */
var Http2ServerResponse = require('http2').Http2ServerResponse;
var decorator = require('./responseDecorator');
/**
 * Response prototype.
 * @public
 */

var res = decorator(Object.create(Http2ServerResponse.prototype));

/**
 * Add setter for statusMessage as it's deprecated, node doesn't set setter only getter
 * so without setting this setter it fails
 * Remove if node adds deprecation setter as well
 */
Object.defineProperty(res, 'statusMessage', {
  set: function (x) {
    //Empty setter for statusMessage    
  }
});

/**
 * Module exports.
 * @public
 */

module.exports = res;

