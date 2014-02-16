/*!
 * Connect - static
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var send = require('send')
  , utils = require('../utils')
  , parse = utils.parseUrl
  , url = require('url');

/**
 * Static:
 *
 *   Static file server with the given `root` path.
 *
 * Examples:
 *
 *     var oneDay = 86400000;
 *
 *     connect()
 *       .use(connect.static(__dirname + '/public'))
 *
 *     connect()
 *       .use(connect.static(__dirname + '/public', { maxAge: oneDay }))
 *
 * Options:
 *
 *    - `maxAge`     Browser cache maxAge in milliseconds. defaults to 0
 *    - `hidden`     Allow transfer of hidden files. defaults to false
 *    - `redirect`   Redirect to trailing "/" when the pathname is a dir. defaults to true
 *    - `index`      Default file name, defaults to 'index.html'
 *
 * @param {String} root
 * @param {Object} options
 * @return {Function}
 * @api public
 */

exports = module.exports = function(root, options){
  options = options || {};

  // root required
  if (!root) throw new Error('static() root path required');

  // default redirect
  var redirect = false !== options.redirect;

  return function staticMiddleware(req, res, next) {
    if ('GET' != req.method && 'HEAD' != req.method) return next();
    var originalUrl = url.parse(req.originalUrl);
    var path = parse(req).pathname;

    if (path == '/' && originalUrl.pathname[originalUrl.pathname.length - 1] != '/') {
      return directory();
    }

    function directory() {
      if (!redirect) return next();
      var target;
      originalUrl.pathname += '/';
      target = url.format(originalUrl);
      res.statusCode = 303;
      res.setHeader('Location', target);
      res.end('Redirecting to ' + utils.escape(target));
    }

    function error(err) {
      if (404 == err.status) return next();
      next(err);
    }

    send(req, path)
      .maxage(options.maxAge || 0)
      .root(root)
      .index(options.index || 'index.html')
      .hidden(options.hidden)
      .on('error', error)
      .on('directory', directory)
      .pipe(res);
  };
};
