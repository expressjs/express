
// Express - HTTP - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var http = require('http'),
    utils = require('express/utils'),
    parse = require('url').parse,
    queryString = require('querystring')
    
/**
 * Request using the given _method_, _url_
 * followed by optional _headers_, and _data_.
 *
 * @param  {string} method
 * @param  {string} url
 * @param  {hash} headers
 * @param  {hash} data
 * @param  {function} fn
 * @api private
 */
    
function request(method, url, headers, data, fn) {
  var buf = '',
      url = parse(url),
      path = url.pathname || '/',
      search = url.search || '',
      hash = url.hash || '',
      port = url.port || 80,
      headers = utils.mixin(headers, { host: url.hostname }),
      client = http.createClient(port, url.hostname)
  client.addListener('error', function(e){
    fn(new Error("client failed to " + method + " `" + url.href + "'"))
  })
  if (data) {
    data = queryString.stringify(data)
    headers['content-length'] = data.length
    headers['content-type'] = 'application/x-www-form-urlencoded'
  }
  var req = client.request(method, path + search + hash, headers)
  if (data) req.write(data)
  req.addListener('response', function(res){
    if (req.statusCode < 200 || req.statusCode >= 400)
      e(new Error('request failed with status ' + res.statusCode + ' "' + http.STATUS_CODES[res.statusCode] + '"'))
    else if (res.statusCode >= 300 && res.statusCode < 400)
      request(method, res.headers.location, headers, data, fn)
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
  return function(url, headers, data, fn) {
    return request(method.toUpperCase(), url, headers, data, fn)
  }
}

// --- Public API

exports.get  = exports.view    = client('get')
exports.post = exports.create  = client('post')
exports.put  = exports.update  = client('put')
exports.del  = exports.destroy = client('delete')

exports.get('http://www.google.ca', {}, {}, function(e, content){
  if (!e)
    require('sys').p(content.length)
})
