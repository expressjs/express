'use strict';

/**
 * Module dependencies.
 * @private
 */

var diagnostics_channel = require('node:diagnostics_channel');

/**
 * Module exports.
 * @public
 */

module.exports = {
  requestStart: diagnostics_channel.channel('express.request.start'),
  requestEnd: diagnostics_channel.channel('express.request.end'),
  requestError: diagnostics_channel.channel('express.request.error'),
  middlewareStart: diagnostics_channel.channel('express.middleware.start'),
  middlewareEnd: diagnostics_channel.channel('express.middleware.end'),
  middlewareError: diagnostics_channel.channel('express.middleware.error'),
  routeMatch: diagnostics_channel.channel('express.route.match')
};
