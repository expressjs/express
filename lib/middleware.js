
/**
 * Module dependencies.
 */

var parseUrl = require('./utils').parseUrl;
var qs = require('qs');

/**
 * Initialization middleware, exposing the
 * request and response to eachother, as well
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

    req.__proto__ = app.request;
    res.__proto__ = app.response;

    res.locals = res.locals || Object.create(null);

    next();
  }
};

/**
 * Query:
 *
 * Automatically parse the query-string when available,
 * populating the `req.query` object using
 * [qs](https://github.com/visionmedia/node-querystring).
 *
 * Examples:
 *
 *       .use(connect.query())
 *       .use(function(req, res){
 *         res.end(JSON.stringify(req.query));
 *       });
 *
 *  The `options` passed are provided to qs.parse function.
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

exports.query = function query(options){
  return function query(req, res, next){
    if (!req.query) {
      req.query = ~req.url.indexOf('?')
        ? qs.parse(parseUrl(req).query, options)
        : {};
    }

    next();
  };
};
