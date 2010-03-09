
// Express - HTTP - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var http = require('http'),
    utils = require('express/utils'),
    parse = require('url').parse,
    queryString = require('querystring')
    
/**
 * Mega super awesome private request utility.
 *
 * @param  {string} method
 * @param  {string} url
 * @param  {hash} data
 * @param  {hash} headers
 * @param  {function} fn
 * @param  {number} redirects
 * @api private
 */
    
function request(method, url, data, headers, fn, redirects) {
  var buf = '',
      redirects = redirects || 3,
      url = parse(url),
      path = url.pathname || '/',
      search = url.search || '',
      hash = url.hash || '',
      port = url.port || 80,
      headers = utils.mixin(headers, { host: url.hostname }),
      client = http.createClient(port, url.hostname)
  if (headers.redirect)
    redirects = headers.redirect,
    delete headers.redirect
  if (data) {
    data = queryString.stringify(data)
    headers['content-length'] = data.length
    headers['content-type'] = 'application/x-www-form-urlencoded'
  }
  var req = client.request(method, path + search + hash, headers)
  if (data) req.write(data)
  req.addListener('response', function(res){
    if (req.statusCode < 200 || req.statusCode >= 400)
      fn(new Error('request failed with status ' + res.statusCode + ' "' + http.STATUS_CODES[res.statusCode] + '"'))
    else if (res.statusCode >= 300 && res.statusCode < 400)
      if (--redirects)
        request(method, res.headers.location, headers, data, fn, redirects)
      else
        fn(new Error('maximum number of redirects reached'))
    else {
      res.setBodyEncoding('utf8')
      res
        .addListener('data', function(chunk){ buf += chunk })
        .addListener('end', function(){ fn(null, buf, res) })
    }
  })
  req.close()
}

/**
 * Return HTTP Client function for the given _method_.
 *
 * @param  {string} method
 * @return {function}
 * @api private
 */

function client(method) {
  return function() {
    var headers, data,
        args = Array.prototype.slice.call(arguments),
        url = args.shift(),
        fn = args.pop(),
        data = args.shift(),
        headers = args.shift()
    if (typeof fn !== 'function')
      throw new TypeError('http client requires a callback function')
    return request(method.toUpperCase(), url, data, headers, fn)
  }
}

// --- Public API

exports.get  = exports.view    = client('get')
exports.post = exports.create  = client('post')
exports.put  = exports.update  = client('put')
exports.del  = exports.destroy = client('delete')
