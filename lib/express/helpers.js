
// Express - Helpers - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Default response code bodies.
 */

var statusBodies = {
  100: 'Continue',
  101: 'Switching Protocols',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Moved Temporarily',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Time-out',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Large',
  415: 'Unsupported Media Type',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Time-out',
  505: 'HTTP Version not supported'
}

/**
 * JSON encode _object_.
 *
 * @param  {string} object
 * @return {string}
 * @api public
 */

exports.jsonEncode = function(object) {
  return JSON.stringify(object)
}

/**
 * JSON decode _string_.
 *
 * @param  {string} string
 * @return {mixed}
 * @api public
 */

exports.jsonDecode = function(string) {
  return JSON.parse(string)
}

/**
 * Return the directory name of the given _path_.
 *
 * @param  {string} path
 * @return {string}
 * @api public
 */

exports.dirname = function(path) {
  return path.split('/').slice(0, -1).join('/')
}

/**
 * Return the extension name of the given _path_,
 * or null when not present.
 *
 * @param  {string} path
 * @return {string}
 * @api public
 */

exports.extname = function(path) {
  if (path.lastIndexOf('.') < 0) return
  return path.slice(path.lastIndexOf('.') + 1)
}

/**
 * Return a placeholder route param keyed 
 * with the given _key_ or null.
 *
 * @param  {string} key
 * @return {string}
 * @api public
 */

exports.param = function(key) {
  return Express.router.params[key]
}

/**
 * Set response header _key_ and _val_ or get
 * request header value by _key_.
 *
 * @param  {string} key
 * @param  {string} val
 * @return {string}
 * @api public
 */

exports.header = function(key, val) {
  return val === undefined ?
    Express.server.request.headers[key.toLowerCase()] :
      Express.server.response.headers[key.toLowerCase()] = val
}

/**
 * Set response status to _code_.
 *
 * @param  {int} code
 * @return {int}
 * @api public
 */

var status = exports.status = function(code) {
  return Express.server.response.status = code
}

/**
 * Immediately respond with response _code_ and _body_.
 * The status _code_ defaults to to 404, and _body_ will
 * default to the default body associated with the response
 * _code_.
 *
 * When an invalid status _code_ is passed, InvalidStatusCode
 * will be thrown.
 *
 * @param  {int} code
 * @param  {string} body
 * @see statusBodies
 * @api public
 */

exports.halt = function(code, body) {
  status(code = code || 404)
  if (body = body || statusBodies[code])
    return Express.server.respond(body)
  throw new InvalidStatusCode(code)
}

/**
 * Escape special characters in _html_.
 *
 * @param  {string} html
 * @return {string}
 * @api public
 */

exports.escape = function(html) {
  if (html instanceof String)
    return html
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
}

/**
 * Convert native array-like objects into an
 * array with optional _offset_.
 *
 * @param  {object} arr
 * @param  {int} offset
 * @return {array}
 * @api public
 */

exports.toArray = function(arr, offset) {
  return Array.prototype.slice.call(arr, offset)
}

/**
 * Escape RegExp _chars_ in _string_. Where _chars_ 
 * defaults to regular expression special characters.
 *
 * _chars_ should be a space delimited list of characters,
 * for example '[ ] ( )'.
 *
 * @param  {string} string
 * @param  {string} chars
 * @return {Type}
 * @api public
 */

exports.escapeRegexp = function(string, chars) {
  var specials = (chars || '/ . * + ? | ( ) [ ] { } \\').split(' ').join('|\\')
  return string.replace(new RegExp('(\\' + specials + ')', 'g'), '\\$1')
}

/**
 * Parse nested _params_.
 *
 * @param  {hash} params
 * @return {hash}
 * @see parseParams() 
 * @api private
 */

function parseNestedParams(params) {
  var parts, key
  for (key in params)
    if (parts = key.split('['))
      if (parts.length > 1)
        for (var i = 0, prop = params, len = parts.length; i < len; ++i) {
          var name = parts[i].replace(']', '')
          if (i == len - 1)
            prop[name] = params[key],
            prop = params, 
            delete params[key]
          else
            prop = prop[name] = prop[name] || {}
        }
  return params
}

/**
 * Parse params _string_ into a nested hash.
 *
 * @param  {string} string
 * @return {hash}
 * @api public
 */

exports.parseParams = function(string) {
  var params = {}, pairs = string.split('&'), pair
  for (var i = 0, len = pairs.length; i < len; ++i)
    pair = pairs[i].split('='),
    params[pair[0]] = pair[1]
  return parseNestedParams(params)
}