'use strict';

/**
 * Module dependencies.
 */

var BaseRouter = require('router');
var methods = require('../utils').methods;
var matchHeaders = require('../utils').matchHeaders;

/**
 * Module variables.
 */

var slice = Array.prototype.slice;

/**
 * Create a custom Router with header matching support.
 *
 * @param {Object} options - Router options
 * @return {Function} Router function
 * @api public
 */

function Router(options) {
  var router = BaseRouter(options);

  var originalRoute = router.route.bind(router);
  router.route = function route(path, opts) {
    var r = originalRoute(path);

    if (opts && opts.headers) {
      return wrapRouteWithHeaders(r, opts.headers);
    }

    return r;
  };

  methods.forEach(function(method) {
    var originalMethod = router[method];
    if (typeof originalMethod === 'function') {
      router[method] = function(path) {
        var args = slice.call(arguments, 1);
        var opts = null;

        if (args.length > 0 && typeof args[0] === 'object' &&
            typeof args[0] !== 'function' && !Array.isArray(args[0])) {
          opts = args[0];
          args = args.slice(1);
        }

        var r = this.route(path, opts);
        r[method].apply(r, args);
        return this;
      };
    }
  });

  var originalAll = router.all;
  if (typeof originalAll === 'function') {
    router.all = function all(path) {
      var args = slice.call(arguments, 1);
      var opts = null;

      if (args.length > 0 && typeof args[0] === 'object' &&
          typeof args[0] !== 'function' && !Array.isArray(args[0])) {
        opts = args[0];
        args = args.slice(1);
      }

      var r = this.route(path, opts);
      for (var i = 0; i < methods.length; i++) {
        r[methods[i]].apply(r, args);
      }
      return this;
    };
  }

  return router;
}

/**
 * Expose Route from BaseRouter.
 */

Router.Route = BaseRouter.Route;

/**
 * Wrap a Route object with header matching middleware.
 * Returns a proxy Route object that adds header checking middleware
 * before each handler.
 *
 * @param {Route} route - The original Route object
 * @param {Object} headers - The headers to match
 * @return {Object} A wrapped Route object
 * @private
 */

function wrapRouteWithHeaders(route, headers) {
  var wrappedRoute = Object.create(route);

  wrappedRoute.headers = function(newHeaders) {
    headers = Object.assign({}, headers, newHeaders);
    return wrappedRoute;
  };

  var headerMiddleware = function createHeaderMiddleware(expectedHeaders) {
    return function headerCheck(req, res, next) {
      if (matchHeaders(req.headers, expectedHeaders)) {
        next();
      } else {
        next('route');
      }
    };
  };

  methods.forEach(function(method) {
    var originalMethod = route[method];
    if (typeof originalMethod === 'function') {
      wrappedRoute[method] = function() {
        var args = slice.call(arguments);
        args.unshift(headerMiddleware(headers));
        return originalMethod.apply(route, args);
      };
    }
  });

  var originalAll = route.all;
  if (typeof originalAll === 'function') {
    wrappedRoute.all = function() {
      var args = slice.call(arguments);
      args.unshift(headerMiddleware(headers));
      return originalAll.apply(route, args);
    };
  }

  return wrappedRoute;
}

/**
 * Expose `Router()`.
 */

module.exports = Router;
