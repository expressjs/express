
/*!
 * Express - middleware - init
 * Copyright(c) 2010-2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

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
    var charset;
    res.setHeader('X-Powered-By', 'Express');
    req.app = res.app = app;
    req.res = res;
    res.req = req;
    req.next = next;

    req.__proto__ = app.request;
    res.__proto__ = app.response;

    res.locals = function(obj){
      for (var key in obj) res.locals[key] = obj[key];
      return res;
    };

    next();
  }
};
