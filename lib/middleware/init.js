/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';
/**
 * Module dependencies.
 * @private
 */

var setPrototypeOf = require('setprototypeof');
var isHttp2Supported = require('../utils').isHttp2Supported;
var http2Request = null;

if (isHttp2Supported) {
  http2Request = require('http2').Http2ServerRequest;
}
/**
 * Initialization middleware, exposing the
 * request and response to each other, as well
 * as defaulting the X-Powered-By header field.
 *
 * @param {Function} app
 * @return {Function}
 * @api private
 */

exports.init = function(app){
  return function expressInit(req, res, next){
    if (app.enabled('x-powered-by')) res.setHeader('X-Powered-By', 'Express');
    req.res = res;
    res.req = req;
    req.next = next;
    if (isHttp2Supported && req instanceof http2Request) {
      setPrototypeOf(req, app.http2Request)
      setPrototypeOf(res, app.http2Response)
    } else {
      setPrototypeOf(req, app.request)
      setPrototypeOf(res, app.response)
    }


    res.locals = res.locals || Object.create(null);

    next();
  };
};

