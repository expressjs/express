
// Express - HTTP - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var http = require('http'),
    parse = require('url').parse,
    queryString = require('querystring')
    
/**
 * Mega super awesome private request utility.
 *
 * @param  {string} method
 * @param  {string} url
 * @param  {hash} data
 * @param  {hash} headers
 * @param  {function} callback
 * @param  {number} redirects
 * @api private
 */
    
function request(method, url, data, headers, callback, redirects) {
  var buf = '',
      redirects = redirects || 3,
      url = parse(url),
      path = url.pathname || '/',
      search = url.search || '',
      hash = url.hash || '',
      port = url.port || 80,
      headers = { host: url.hostname }.merge(headers || {}),
      client = http.createClient(port, url.hostname)
  if (headers.redirect)
    redirects = headers.redirect,
    delete headers.redirect
  if (data) {
    data = queryString.stringify(data)
    if (method === 'GET')
      search += (search ? '&' : '?') + data
    else
      headers['content-length'] = data.length,
      headers['content-type'] = 'application/x-www-form-urlencoded'
  }
  var req = client.request(method, path + search + hash, headers)
  if (data && method !== 'GET') req.write(data)
  req.addListener('response', function(res){
    if (req.statusCode < 200 || req.statusCode >= 400)
      callback(new Error('request failed with status ' + res.statusCode + ' "' + http.STATUS_CODES[res.statusCode] + '"'))
    else if (res.statusCode >= 300 && res.statusCode < 400)
      if (--redirects)
        request(method, res.headers.location, headers, data, callback, redirects)
      else
        callback(new Error('maximum number of redirects reached'))
    else {
      res.setBodyEncoding('utf8')
      res
        .addListener('data', function(chunk){ buf += chunk })
        .addListener('end', function(){ callback(null, buf, res) })
    }
  })
  req.end()
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
        callback = args.pop(),
        data = args.shift(),
        headers = args.shift()
    if (typeof callback !== 'function')
      throw new TypeError('http client requires a callback function')
    return request(method.toUpperCase(), url, data, headers, callback)
  }
}

// --- Public API

exports.get  = exports.view    = client('get')
exports.post = exports.create  = client('post')
exports.put  = exports.update  = client('put')
exports.del  = exports.destroy = client('delete')
