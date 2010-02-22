
// Express - MockRequest - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

// --- MockRequest

var MockRequest = Class({
  
  /**
   * Default HTTP version.
   */
  
  httpVersion: '1.1',
  
  /**
   * Initialize with _method_, _path_ and _options_.
   *
   * @param  {string} method
   * @param  {string} path
   * @param  {hash} options
   * @api private
   */
  
  init: function(method, path, options) {
    this.method = method
    this.url = path
    this.connection = {
      remoteAddress: '127.0.0.1'
    }
    this.headers = {
      'host': 'localhost',
      'user-agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-us) AppleWebKit/530.19.2 (KHTML, like Gecko) Version/4.0.2 Safari/530.19',
      'accept': 'application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5',
      'accept-language': 'en-us',
      'connection': 'keep-alive'
    }
    process.mixin(true, this, options)
  }
})

// --- MockResponse

var MockResponse = Class({
  
  /**
   * Store _code_ and _headers_.
   */
  
  writeHeader: function(code, headers) {
    this.status = code
    this.headers = headers
  },
  
  /**
   * Store _body_.
   */
  
  write: function(body) {
    this.body = body
  },
  
  /**
   * Flag response as finished.
   */
  
  finish: function() {
    this.finished = true
  }
})

/**
 * Mock a request with the given _method_, _path_,
 * and _options_. Returns the response for assertions.
 *
 * All _options_ are passed to MockRequest which
 * performs a deep copy so you may alter headers etc.
 *
 * @param  {string} method
 * @param  {string} path
 * @param  {hash} options
 * @return {MockResponse}
 * @api private
 */

function request(method, path, options, fn) {
  var response = new MockResponse
  var request = new MockRequest(method, path, options)
  Express.server.route(request, response)
  return response
}

/**
 * Request Express data which may have been
 * manipulated by the mock request.
 *
 * @api public
 */

reset = function() {
  Express.routes = []
  Express.plugins = []
  Express.settings = {}
  configure('test')
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