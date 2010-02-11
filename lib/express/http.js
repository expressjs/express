
// Express - HTTP - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var http = require('http'),
    events = require('events'),
    parse = require('url').parse
    
function request(method, url, headers, promise) {
  var buf = '',
      promise = promise || new events.Promise,
      url = parse(url),
      path = url.pathname || '/',
      port = url.port || 80,
      headers = process.mixin(headers, { host: url.hostname }),
      client = http.createClient(port, url.hostname)
  client.addListener('error', function(e){
    promise.emitError(new Error("client failed to " + method + " `" + url.href + "'"))
  })
  client.request(method, path, headers).finish(function(response){
    if (response.statusCode < 200 || response.statusCode >= 400)
      promise.emitError(new Error('request failed with status ' + response.statusCode + ' "' + http.STATUS_CODES[response.statusCode] + '"'))
    else if (response.statusCode >= 300 && response.statusCode < 400)
      request(method, response.headers.location, headers, promise)
    else {
      response.setBodyEncoding('utf8')
      response
        .addListener('body', function(chunk){ buf += chunk })
        .addListener('complete', function(){ promise.emitSuccess(buf, response) })
    }
  })
  return promise
}

exports.get = function(url, headers) {
  return request('GET', url, headers)
}

exports.post = function(url, headers) {
  return request('POST', url, headers)
}

exports.post('http://google.com')
  .addCallback(function(content, response){
    puts(content)
    p(response.headers)
  })
