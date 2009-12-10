
// Express - MockRequest - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

// --- MockRequest

var MockRequest = Class({
  uri: {
    queryString: '',
    fragment: '',
    params: {},
  },
  httpVersion: '1.1',
  connection: {
    remoteAddress: '127.0.0.1'
  },
  headers: {
    'host': 'localhost:3000',
    'user-agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-us) AppleWebKit/530.19.2 (KHTML, like Gecko) Version/4.0.2 Safari/530.19',
    'accept': 'application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5',
    'accept-language': 'en-us',
    'connection': 'keep-alive'
  },
  init: function(method, path, options) {
    this.method = method
    this.uri.path = this.uri.full = path
    process.mixin(true, this, options)
  }
})

// --- MockResponse

var MockResponse = Class({
  sendHeader: function(code, headers) {
    this.status = code
    this.headers = headers
  },
  sendBody: function(body) {
    this.body = body
  },
  finish: function() {
    this.finished = true
  }
})

function request(method, path, options, fn) {
  var response = new MockResponse
  var request = new MockRequest(method, path, options)
  Express.server.route(request, response)
  return response
}

reset = function() {
  Express.routes = []
  Express.settings = {}
}

/**
 * Return a mock routing function for _method_.
 *
 * @param  {string} method
 * @return {function}
 * @api private
 */

function route(method) {
  return function(path, options, fn){
    if (options instanceof Function)
      fn = options, options = {}
    if (fn instanceof Function)
      Express.routes.push(new Route(method, path, fn, options))
    else
      return request(method, path, options, fn)
  }
}

// --- Mock routing API

get = view = route('get')
post = create = route('post')
del = destroy = route('delete')
put = update = route('put')