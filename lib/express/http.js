
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
    
function request(method, url, data, headers, callback, redirects, first) {
  var buf = '',
      redirects = typeof redirects !== 'number' ? 3 : redirects,
      url = parse(url),
      path = url.pathname || '/',
      search = url.search || '',
      hash = url.hash || '',
      port = url.port || 80,
      headers = Object.merge(headers || {}, { Host: url.hostname }),
      client = http.createClient(port, url.hostname)
  if (typeof data === 'object' && 'redirects' in data)
    redirects = data.redirects,
    delete data.redirects
  if (first && data) {
    if (typeof data !== 'string')
      data = queryString.stringify(data)
    if (method === 'GET')
      search += (search ? '&' : '?') + data
    else {
      if (!headers['Content-Length'])
        headers['Content-Length'] = data.length
      if (!headers['Content-Type'])
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
  }
  var req = client.request(method, path + search + hash, headers)
  if (data && method !== 'GET') req.write(data)
  req.addListener('response', function(res){
    if (res.statusCode < 200 || res.statusCode >= 400)
      callback(new Error('request failed with status ' + res.statusCode + ' "' + http.STATUS_CODES[res.statusCode] + '"'), '', res)
    else if (res.statusCode >= 300 && res.statusCode < 400)
      if (redirects--)
        request(method, res.headers.location, data, headers, callback, redirects, false)
      else
        callback(new Error('maximum number of redirects reached'), '', res)
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
    var redirects,
        args = Array.prototype.slice.call(arguments),
        url = args.shift(),
        callback = args.pop(),
        data = args.shift(),
        headers = args.shift()
    if (typeof callback !== 'function')
      throw new TypeError('http client requires a callback function')
    return request(method.toUpperCase(), url, data, headers, callback, redirects, true)
  }
}

// --- Public API

/**
 * Examples:
 *
 *   var http = require('express/http')
 *
 *   http.get('http://google.com/search', { q: 'foobar' }, function(err, body, response){
 *     if (!err) sys.puts(body)
 *   })
 *
 *   http.get('http://google.com/search?lang=en', { q: 'foobar' }, function(){
 *     // ...
 *   })
 *
 *   http.post('http://localhost:8000', '<user>tj</user>', { 'Content-Type': 'text/xml' }, function(err, body){
 *     // ...
 *   })
 *
 */

exports.get  = exports.view    = client('get')
exports.post = exports.create  = client('post')
exports.put  = exports.update  = client('put')
exports.del  = exports.destroy = client('delete')
