
/*!
 * Express - request
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var http = require('http')
  , req = http.IncomingMessage.prototype
  , utils = require('./utils')
  , parse = require('url').parse
  , mime = require('mime');

/**
 * Default notification formatters.
 */

var defaultFormatters = exports.formatters = {
    s: String
  , d: function(val){ return val | 0; }
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
 *     // => "text/plain"
 *     
 *     req.header('content-type');
 *     // => "text/plain"
 *     
 *     req.header('Accept');
 *     // => undefined
 *     
 *     req.header('Accept', 'text/html');
 *     // => "text/html"
 *
 * @param {String} name
 * @param {String} defaultValue
 * @return {String} 
 * @api public
 */

req.header = function(name, defaultValue){
  switch (name = name.toLowerCase()) {
    case 'referer':
    case 'referrer':
      return this.headers.referrer
        || this.headers.referer
        || defaultValue;
    default:
      return this.headers[name] || defaultValue;
  }
};

/**
 * Get `field`'s `param` value, defaulting to ''.
 *
 * Examples:
 *
 *     req.get('content-disposition', 'filename');
 *     // => "something.png"
 *
 *     req.get('content-disposition', 'rawr');
 *     // => ""
 *
 * @param {String} field
 * @param {String} param
 * @return {String}
 * @api public
 */

req.get = function(field, param){
  var val = this.header(field);
  if (!val) return '';
  var regexp = new RegExp(param + ' *= *(?:"([^"]+)"|([^;]+))', 'i');
  if (!regexp.exec(val)) return '';
  return RegExp.$1 || RegExp.$2;
};

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
 * Check if the _Accept_ header is present, and includes the given `type`.
 *
 * When the _Accept_ header is not present `true` is returned. Otherwise
 * the given `type` is matched by an exact match, and then subtypes. You
 * may pass the subtype such as "html" which is then converted internally
 * to "text/html" using the mime lookup table.
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
  var accept = this.header('Accept')
    , type = String(type);

  // when not present or "*/*" accept anything
  if (!accept || '*/*' == accept) return true;

  // normalize extensions ".json" -> "json"
  if ('.' == type[0]) type = type.substr(1);

  // allow "html" vs "text/html" etc
  if (!~type.indexOf('/')) type = mime.lookup(type);

  // check if we have a direct match
  if (~accept.indexOf(type)) return true;

  // check if we have type/*
  type = type.split('/')[0] + '/*';
  return !! ~accept.indexOf(type);
};

/**
 * Return the value of param `name` when present or `defaultValue`.
 *
 *  - Checks route placeholders, ex: _/user/:id_
 *  - Checks query string params, ex: ?id=12
 *  - Checks urlencoded body params, ex: id=12
 *
 * To utilize urlencoded request bodies, `req.body`
 * should be an object. This can be done by using
 * the `connect.bodyParser` middleware.
 *
 * @param {String} name
 * @param {Mixed} defaultValue
 * @return {String}
 * @api public
 */

req.param = function(name, defaultValue){
  // route params like /user/:id
  if (this.params
    && this.params.hasOwnProperty(name)
    && undefined !== this.params[name]) {
    return this.params[name]; 
  }
  // query string params
  if (undefined !== this.query[name]) return this.query[name]; 

  // request body params via connect.bodyParser
  if (this.body && undefined !== this.body[name]) return this.body[name];

  return defaultValue;
};

/**
 * Queue flash `msg` of the given `type`.
 *
 * This method is aliased as `req.notify()`.
 *
 * Examples:
 *
 *      req.notify('info', 'email sent');
 *      req.notify('info', 'email sent');
 *      req.notify('error', 'email delivery failed');
 *      req.notify('info', 'email re-sent');
 *      // => 2
 *
 *      req.notify('info');
 *      // => ['email sent', 'email re-sent']
 *
 *      req.notify('info');
 *      // => []
 *
 *      req.notify();
 *      // => { error: ['email delivery failed'], info: [] }
 *
 * Formatting:
 *
 * Flash notifications also support arbitrary formatting support.
 * For example you may pass variable arguments to `req.notify()`
 * and use the %s specifier to be replaced by the associated argument:
 *
 *     req.notify('info', 'email has been sent to %s.', userName);
 *
 * You may add addition formatters by defining `app.formatters`,
 * for example in the following snippet we define `%u` to uppercase
 * a string:
 *
 *      app.formatters = {
 *        u: function(val){
 *          return String(val).toUpperCase();
 *        }
 *      };
 *
 * @param {String} type
 * @param {String} msg
 * @return {Array|Object|Number}
 * @api public
 */

req.notify = function(type, msg){
  var sess = this.session;
  if (null == sess) throw Error('req.notify() requires sessions');
  var msgs = sess.notifications = sess.notifications || {};

  switch (arguments.length) {
    // flush all messages
    case 0:
      sess.notifications = {};
      return msgs
    // flush messages for a specific type
    case 1:
      var arr = msgs[type];
      delete msgs[type];
      return arr || [];
    // set notification message
    default:
      var i = 2
        , args = arguments
        , formatters = this.app.formatters || {};
      formatters.__proto__ = defaultFormatters;
      msg = utils.miniMarkdown(msg);
      msg = msg.replace(/%([a-zA-Z])/g, function(_, format){
        var formatter = formatters[format];
        if (formatter) return formatter(utils.escape(args[i++]));
      });
      return (msgs[type] = msgs[type] || []).push(msg);
  }
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
 *      // => true
 *     
 *      // When Content-Type is application/json
 *      req.is('json');
 *      req.is('application/json');
 *      // => true
 *     
 *      req.is('html');
 *      // => false
 * 
 * Ad-hoc callbacks can also be registered with Express, to perform
 * assertions again the request, for example if we need an expressive
 * way to check if our incoming request is an image, we can register "an image"
 * callback:
 * 
 *       app.is('an image', function(req){
 *         return 0 == req.headers['content-type'].indexOf('image');
 *       });
 *
 *       app.is('an attachment', function(req){
 *         return 0 == req.headers['content-disposition'].indexOf('attachment');
 *       });
 *
 *  Now within our route callbacks, we can use to to assert content types
 *  such as "image/jpeg", "image/png", etc.
 * 
 *      app.post('/image/upload', function(req, res, next){
 *        if (req.is('an image')) {
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
  var fn = this.app.is(type);
  if (fn) return fn(this);
  var contentType = this.headers['content-type'];
  if (!contentType) return;
  if (!~type.indexOf('/')) type = mime.lookup(type);
  if (~type.indexOf('*')) {
    type = type.split('/');
    contentType = contentType.split('/');
    if ('*' == type[0] && type[1] == contentType[1]) return true;
    if ('*' == type[1] && type[0] == contentType[0]) return true;
  }
  return !! ~contentType.indexOf(type);
};

// Callback for isXMLHttpRequest / xhr

function isxhr() {
  return this.header('X-Requested-With', '').toLowerCase() === 'xmlhttprequest';
}

/**
 * Check if the request was an _XMLHttpRequest_.
 *
 * @return {Boolean}
 * @api public
 */

req.__defineGetter__('isXMLHttpRequest', isxhr);
req.__defineGetter__('xhr', isxhr);
