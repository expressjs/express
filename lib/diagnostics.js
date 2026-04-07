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

var dc = require('node:diagnostics_channel');

/**
 * Diagnostic channels for Express request lifecycle.
 *
 * These channels allow APM tools, monitoring systems, and
 * instrumentation libraries to observe Express request
 * processing without monkey-patching.
 *
 * @private
 */

module.exports = {
  /**
   * Published when Express begins handling an incoming request,
   * before routing. Message: { req, res }
   */
  requestStart: dc.channel('express.request.start'),

  /**
   * Published when the response has been fully sent to the client.
   * Message: { req, res }
   */
  requestFinish: dc.channel('express.request.finish'),

  /**
   * Published when a connection error occurs during request
   * processing (e.g. ECONNRESET, ECONNABORTED).
   * Message: { req, res, error }
   */
  requestError: dc.channel('express.request.error')
};
