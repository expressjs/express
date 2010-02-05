
// Express - HTTP - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var http = require('http'),
    events = require('events'),
    parse = require('url').parse

function request(method, url, headers, promise) {
  require('sys').p(url)
  var buf = '',
      promise = promise || new events.Promise,
      url = parse(url),
      path = url.pathname || '/',
      port = url.port || 80,
      headers = process.mixin({ host: url.hostname }, headers),
      client = http.createClient(port, url.hostname)
  client.request(method, path, headers).finish(function(response){
    if (response.statusCode < 200 && response.statusCode >= 400)
      promise.emitError(new Error('request failed with status ' + response.statusCode))
    else if (response.statusCode >= 300 && response.statusCode < 400)
      request(method, response.headers.location, headers, promise)
    else {
      response.setBodyEncoding('utf8')
      response.addListener('body', function(chunk){ buf += chunk })
      response.addListener('complete', function(){ promise.emitSuccess(buf, response) })
    }
  })
  return promise
}

exports.get = function(url, headers, fn) {
  if (typeof headers == 'function') fn = headers
  request('GET', url, headers)
    .addErrback(fn)
    .addCallback(fn)
}

exports.get('http://www.vision-media.ca/', function(content){
  require('sys').p(content)
})