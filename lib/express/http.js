
// Express - HTTP - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var http = require('http'),
    events = require('events'),
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
 * @param  {Promise} promise
 * @return {Promise}
 * @api private
 */
    
function request(method, url, headers, data, promise) {
  var buf = '',
      promise = promise || new events.Promise,
      url = parse(url),
      path = url.pathname || '/',
      search = url.search || '',
      hash = url.hash || '',
      port = url.port || 80,
      headers = process.mixin(headers, { host: url.hostname }),
      client = http.createClient(port, url.hostname)
  client.addListener('error', function(e){
    promise.emitError(new Error("client failed to " + method + " `" + url.href + "'"))
  })
  if (data) {
    data = queryString.stringify(data)
    headers['content-length'] = data.length
    headers['content-type'] = 'application/x-www-form-urlencoded'
  }
  var request = client.request(method, path + search + hash, headers)
  if (data) request.write(data)
  request.close(function(response){
    if (response.statusCode < 200 || response.statusCode >= 400)
      promise.emitError(new Error('request failed with status ' + response.statusCode + ' "' + http.STATUS_CODES[response.statusCode] + '"'))
    else if (response.statusCode >= 300 && response.statusCode < 400)
      request(method, response.headers.location, headers, data, promise)
    else {
      response.setBodyEncoding('utf8')
      response
        .addListener('body', function(chunk){ buf += chunk })
        .addListener('complete', function(){ promise.emitSuccess(buf, response) })
    }
  })
  return promise
}

/**
 * Return HTTP Client function for the given _method_.
 *
 * @param  {string} method
 * @return {function}
 * @api private
 */

function client(method) {
  return function(url, headers, data) {
    return request(method.toUpperCase(), url, headers, data)
  }
}

// --- Public API

exports.get  = exports.view    = client('get')
exports.post = exports.create  = client('post')
exports.put  = exports.update  = client('put')
exports.del  = exports.destroy = client('delete')
