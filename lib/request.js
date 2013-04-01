
/**
 * Module dependencies.
 */

var http = require('http')
  , utils = require('./utils')
  , connect = require('connect')
  , fresh = require('fresh')
  , parseRange = require('range-parser')
  , parse = connect.utils.parseUrl
  , mime = connect.mime;

/**
 * Request prototype.
 */

var req = exports = module.exports = {
  __proto__: http.IncomingMessage.prototype
};

/**
 * Return request header.
 *
 * The `Referrer` header field is special-cased,
 * both `Referrer` and `Referer` are interchangeable.
 *
 * Examples:
 *
 *     req.get('Content-Type');
 *     // => "text/plain"
 *
 *     req.get('content-type');
 *     // => "text/plain"
 *
 *     req.get('Something');
 *     // => undefined
 *
 * Aliased as `req.header()`.
 *
 * @param {String} name
 * @return {String}
 * @api public
 */

req.get =
req.header = function(name){
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
 * Check if the given `type(s)` is acceptable, returning
 * the best match when true, otherwise `undefined`, in which
 * case you should respond with 406 "Not Acceptable".
 *
 * The `type` value may be a single mime type string
 * such as "application/json", the extension name
 * such as "json", a comma-delimted list such as "json, html, text/plain",
 * or an array `["json", "html", "text/plain"]`. When a list
 * or array is given the _best_ match, if any is returned.
 *
 * Examples:
 *
 *     // Accept: text/html
 *     req.accepts('html');
 *     // => "html"
 *
 *     // Accept: text/*, application/json
 *     req.accepts('html');
 *     // => "html"
 *     req.accepts('text/html');
 *     // => "text/html"
 *     req.accepts('json, text');
 *     // => "json"
 *     req.accepts('application/json');
 *     // => "application/json"
 *
 *     // Accept: text/*, application/json
 *     req.accepts('image/png');
 *     req.accepts('png');
 *     // => undefined
 *
 *     // Accept: text/*;q=.5, application/json
 *     req.accepts(['html', 'json']);
 *     req.accepts('html, json');
 *     // => "json"
 *
 * @param {String|Array} type(s)
 * @return {String}
 * @api public
 */

req.accepts = function(type){
  return utils.accepts(type, this.get('Accept'));
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
 * Parse Range header field,
 * capping to the given `size`.
 *
 * Unspecified ranges such as "0-" require
 * knowledge of your resource length. In
 * the case of a byte range this is of course
 * the total number of bytes. If the Range
 * header field is not given `null` is returned,
 * `-1` when unsatisfiable, `-2` when syntactically invalid.
 *
 * NOTE: remember that ranges are inclusive, so
 * for example "Range: users=0-3" should respond
 * with 4 users when available, not 3.
 *
 * @param {Number} size
 * @return {Array}
 * @api public
 */

req.range = function(size){
  var range = this.get('Range');
  if (!range) return;
  return parseRange(size, range);
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
  var accept = this.get('Accept');
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
  var accept = this.get('Accept-Language');
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
  var accept = this.get('Accept-Charset');
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
 *  - Checks route placeholders, ex: _/user/:id_
 *  - Checks body params, ex: id=12, {"id":12}
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
  var params = this.params || {};
  var body = this.body || {};
  var query = this.query || {};
  if (null != params[name] && params.hasOwnProperty(name)) return params[name];
  if (null != body[name]) return body[name];
  if (null != query[name]) return query[name];
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
 * @param {String} type
 * @return {Boolean}
 * @api public
 */

req.is = function(type){
  var ct = this.get('Content-Type');
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
 * Return the protocol string "http" or "https"
 * when requested with TLS. When the "trust proxy"
 * setting is enabled the "X-Forwarded-Proto" header
 * field will be trusted. If you're running behind
 * a reverse proxy that supplies https for you this
 * may be enabled.
 *
 * @return {String}
 * @api public
 */

req.__defineGetter__('protocol', function(){
  var trustProxy = this.app.get('trust proxy');
  return this.connection.encrypted
    ? 'https'
    : trustProxy
      ? (this.get('X-Forwarded-Proto') || 'http')
      : 'http';
});

/**
 * Short-hand for:
 *
 *    req.protocol == 'https'
 *
 * @return {Boolean}
 * @api public
 */

req.__defineGetter__('secure', function(){
  return 'https' == this.protocol;
});

/**
 * Return the remote address, or when
 * "trust proxy" is `true` return
 * the upstream addr.
 *
 * @return {String}
 * @api public
 */

req.__defineGetter__('ip', function(){
  return this.ips[0] || this.connection.remoteAddress;
});

/**
 * When "trust proxy" is `true`, parse
 * the "X-Forwarded-For" ip address list.
 *
 * For example if the value were "client, proxy1, proxy2"
 * you would receive the array `["client", "proxy1", "proxy2"]`
 * where "proxy2" is the furthest down-stream.
 *
 * @return {Array}
 * @api public
 */

req.__defineGetter__('ips', function(){
  var trustProxy = this.app.get('trust proxy');
  var val = this.get('X-Forwarded-For');
  return trustProxy && val
    ? val.split(/ *, */)
    : [];
});

/**
 * Return basic auth credentials.
 *
 * Examples:
 *
 *    // http://tobi:hello@example.com
 *    req.auth
 *    // => { username: 'tobi', password: 'hello' }
 *
 * @return {Object} or undefined
 * @api public
 */

req.__defineGetter__('auth', function(){
  // missing
  var auth = this.get('Authorization');
  if (!auth) return;

  // malformed
  var parts = auth.split(' ');
  if ('basic' != parts[0].toLowerCase()) return;
  if (!parts[1]) return;
  auth = parts[1];

  // credentials
  auth = new Buffer(auth, 'base64').toString().match(/^([^:]*):(.*)$/);
  if (!auth) return;
  return { username: auth[1], password: auth[2] };
});

/**
 * Return subdomains as an array.
 *
 * Subdomains are the dot-separated parts of the host before the main domain of
 * the app. By default, the domain of the app is assumed to be the last two
 * parts of the host. This can be changed by setting "subdomain offset".
 *
 * For example, if the domain is "tobi.ferrets.example.com":
 * If "subdomain offset" is not set, req.subdomains is `["ferrets", "tobi"]`.
 * If "subdomain offset" is 3, req.subdomains is `["tobi"]`.
 *
 * @return {Array}
 * @api public
 */

req.__defineGetter__('subdomains', function(){
  var offset = this.app.get('subdomain offset');
  return this.get('Host')
    .split('.')
    .reverse()
    .slice(offset);
});

/**
 * Short-hand for `url.parse(req.url).pathname`.
 *
 * @return {String}
 * @api public
 */

req.__defineGetter__('path', function(){
  return parse(this).pathname;
});

/**
 * Parse the "Host" header field hostname.
 *
 * @return {String}
 * @api public
 */

req.__defineGetter__('host', function(){
  var trustProxy = this.app.get('trust proxy');
  var host = trustProxy && this.get('X-Forwarded-Host');
  host = host || this.get('Host');
  return host.split(':')[0];
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
  var method = this.method;
  var s = this.res.statusCode;

  // GET or HEAD for weak freshness validation only
  if ('GET' != method && 'HEAD' != method) return false;

  // 2xx or 304 as per rfc2616 14.26
  if ((s >= 200 && s < 300) || 304 == s) {
    return fresh(this.headers, this.res._headers);
  }

  return false;
});

/**
 * Check if the request is stale, aka
 * "Last-Modified" and / or the "ETag" for the
 * resource has changed.
 *
 * @return {Boolean}
 * @api public
 */

req.__defineGetter__('stale', function(){
  return !this.fresh;
});

/**
 * Check if the request was an _XMLHttpRequest_.
 *
 * @return {Boolean}
 * @api public
 */

req.__defineGetter__('xhr', function(){
  var val = this.get('X-Requested-With') || '';
  return 'xmlhttprequest' == val.toLowerCase();
});
