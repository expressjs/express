
/*!
 * Express - request
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var http = require('http')
  , utils = require('./utils')
  , connect = require('connect')
  , parse = require('url').parse
  , mime = require('mime');

/**
 * Request prototype.
 */

var req = exports = module.exports = {
  __proto__: http.IncomingMessage.prototype
};

/**
 * Return request header or optional default.
 *
 * The `Referrer` header field is special-cased,
 * both `Referrer` and `Referer` will yield are
 * interchangeable.
 *
 * Examples:
 *
 *     req.header('Content-Type');
 *     req.get('Content-Type');
 *     // => "text/plain"
 *     
 *     req.header('content-type');
 *     req.get('content-type');
 *     // => "text/plain"
 *     
 *     req.header('Something');
 *     // => undefined
 *     
 * @param {String} name
 * @return {String} 
 * @api public
 */

req.header = 
req.get = function(name){
  switch (name = name.toLowerCase()) {
    case 'referer':
    case 'referrer':
      return this.headers.referrer
        || this.headers.referer;
    default:
      return this.headers[name];
  }
};

/**
 * Check if the given `type` is acceptable,
 * otherwise you should respond with 406 "Not Acceptable".
 *
 * Examples:
 * 
 *     // Accept: text/html
 *     req.accepts('html');
 *     // => true
 *
 *     // Accept: text/*; application/json
 *     req.accepts('html');
 *     req.accepts('text/html');
 *     req.accepts('text/plain');
 *     req.accepts('application/json');
 *     // => true
 *
 *     req.accepts('image/png');
 *     req.accepts('png');
 *     // => false
 *
 * @param {String} type
 * @return {Boolean}
 * @api public
 */

req.accepts = function(type){
  return utils.accepts(type, this.header('Accept'));
};

/**
 * Check if the given `charset` is acceptable,
 * otherwise you should respond with 406 "Not Acceptable".
 *
 * @param {String} charset
 * @return {Boolean}
 * @api public
 */

req.acceptsCharset = function(charset){
  var accepted = this.acceptedCharsets;
  return accepted.length
    ? ~accepted.indexOf(charset)
    : true;
};

/**
 * Check if the given `lang` is acceptable,
 * otherwise you should respond with 406 "Not Acceptable".
 *
 * @param {String} lang
 * @return {Boolean}
 * @api public
 */

req.acceptsLanguage = function(lang){
  var accepted = this.acceptedLanguages;
  return accepted.length
    ? ~accepted.indexOf(lang)
    : true;
};

/**
 * Return an array of Accepted media types
 * ordered from highest quality to lowest.
 *
 * Examples:
 *
 *     [ { value: 'application/json',
 *         quality: 1,
 *         type: 'application',
 *         subtype: 'json' },
 *       { value: 'text/html',
 *         quality: 0.5,
 *         type: 'text',
 *         subtype: 'html' } ]
 *
 * @return {Array}
 * @api public
 */

req.__defineGetter__('accepted', function(){
  var accept = this.header('Accept');
  return accept
    ? utils.parseAccept(accept)
    : [];
});

/**
 * Return an array of Accepted languages
 * ordered from highest quality to lowest.
 *
 * Examples:
 *
 *     Accept-Language: en;q=.5, en-us
 *     ['en-us', 'en']
 *
 * @return {Array}
 * @api public
 */

req.__defineGetter__('acceptedLanguages', function(){
  var accept = this.header('Accept-Language');
  return accept
    ? utils
      .parseQuality(accept)
      .map(function(obj){
        return obj.value;
      })
    : [];
});

/**
 * Return an array of Accepted charsets
 * ordered from highest quality to lowest.
 *
 * Examples:
 *
 *     Accept-Charset: iso-8859-5;q=.2, unicode-1-1;q=0.8
 *     ['unicode-1-1', 'iso-8859-5']
 *
 * @return {Array}
 * @api public
 */

req.__defineGetter__('acceptedCharsets', function(){
  var accept = this.header('Accept-Charset');
  return accept
    ? utils
      .parseQuality(accept)
      .map(function(obj){
        return obj.value;
      })
    : [];
});

/**
 * Return the value of param `name` when present or `defaultValue`.
 *
 *  - Checks body params, ex: id=12, {"id":12}
 *  - Checks route placeholders, ex: _/user/:id_
 *  - Checks query string params, ex: ?id=12
 *
 * To utilize request bodies, `req.body`
 * should be an object. This can be done by using
 * the `connect.bodyParser()` middleware.
 *
 * @param {String} name
 * @param {Mixed} defaultValue
 * @return {String}
 * @api public
 */

req.param = function(name, defaultValue){
  // req.body
  if (this.body && undefined !== this.body[name]) return this.body[name];

  // route params
  if (this.params
    && this.params.hasOwnProperty(name)
    && undefined !== this.params[name]) {
    return this.params[name]; 
  }

  // query-string
  if (undefined !== this.query[name]) return this.query[name]; 

  return defaultValue;
};

/**
 * Check if the incoming request contains the "Content-Type" 
 * header field, and it contains the give mime `type`.
 *
 * Examples:
 *
 *      // With Content-Type: text/html; charset=utf-8
 *      req.is('html');
 *      req.is('text/html');
 *      req.is('text/*');
 *      // => true
 *     
 *      // When Content-Type is application/json
 *      req.is('json');
 *      req.is('application/json');
 *      req.is('application/*');
 *      // => true
 *     
 *      req.is('html');
 *      // => false
 * 
 *  Now within our route callbacks, we can use to to assert content types
 *  such as "image/jpeg", "image/png", etc.
 * 
 *      app.post('/image/upload', function(req, res, next){
 *        if (req.is('image/*')) {
 *          // do something
 *        } else {
 *          next();
 *        }
 *      });
 * 
 * @param {String} type
 * @return {Boolean}
 * @api public
 */

req.is = function(type){
  var ct = this.headers['content-type'];
  if (!ct) return false;
  ct = ct.split(';')[0];
  if (!~type.indexOf('/')) type = mime.lookup(type);
  if (~type.indexOf('*')) {
    type = type.split('/');
    ct = ct.split('/');
    if ('*' == type[0] && type[1] == ct[1]) return true;
    if ('*' == type[1] && type[0] == ct[0]) return true;
    return false;
  }
  return !! ~ct.indexOf(type);
};

/**
 * Return the protocol string "http" or "https",
 * while optionally trusting X-Forwarded-Proto
 * when running behind a reverse proxy.
 *
 * @param {Boolean} trustProxy
 * @return {String}
 * @api public
 */

req.protocol = function(trustProxy){
  return this.secure
    ? 'https'
    : trustProxy
      ? (this.header('X-Forwarded-Proto') || 'http')
      : 'http';
};

/**
 * Short-hand for `req.connection.encrypted`.
 *
 * @return {Boolean}
 * @api public
 */

req.__defineGetter__('secure', function(){
  return this.connection.encrypted;
});

/**
 * Short-hand for `require('url').parse(req.url).pathname`.
 *
 * @return {String}
 * @api public
 */

req.__defineGetter__('path', function(){
  return parse(this.url).pathname;
});

/**
 * Check if the request is fresh, aka
 * Last-Modified and/or the ETag
 * still match.
 *
 * @return {Boolean}
 * @api public
 */

req.__defineGetter__('fresh', function(){
  return ! this.stale;
});

/**
 * Check if the request is stale, aka
 * Last-Modified and/or the ETag for the
 * resource has changed.
 *
 * @return {Boolean}
 * @api public
 */

req.__defineGetter__('stale', function(){
  return connect.utils.modified(this, this.res);
});

/**
 * Check if the request was an _XMLHttpRequest_.
 *
 * @return {Boolean}
 * @api public
 */

req.__defineGetter__('xhr', function(){
  return 'xmlhttprequest' == this.header('X-Requested-With', '').toLowerCase();
});
