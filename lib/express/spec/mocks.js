
// Express - MockRequest - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */
 
var Request = require('express/request').Request,
    path = require('path'),
    fs = require('fs')

/**
 * Sync fs.readFile()
 */
 
fs.readFile = function(path, encoding, callback) {
  if (encoding instanceof Function)
    callback = encoding,
    encoding = null
  try {
    callback(null, fs.readFileSync(path, encoding))
  } catch (e) {
    callback(e)
  }
}

/**
 * Sync path.exists()
 */
 
path.exists = function(path, callback) {
  try {
    fs.statSync(path)
    callback(true)
  } catch (e) {
    callback(false)
  }
}

/**
 * Sync fs.stat()
 */
 
fs.stat = function(path, callback) {
  try {
    callback(null, fs.statSync(path))
  } catch (e) {
    callback(e)
  }
}

// --- MockRequest

var MockRequest = new Class({
  
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
  
  constructor: function(method, path, options) {
    this.method = method
    this.url = path
    this.connection = { remoteAddress: '127.0.0.1' }
    this.headers = {
      'host': 'localhost',
      'user-agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-us) AppleWebKit/530.19.2 (KHTML, like Gecko) Version/4.0.2 Safari/530.19',
      'accept': 'application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5',
      'accept-language': 'en-us',
      'connection': 'keep-alive'
    }
    Object.mergeDeep(this, options)
  }
})

// --- MockResponse

var MockResponse = new Class({
  
  /**
   * Store _code_ and _headers_.
   */
  
  writeHead: function(code, headers) {
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
  
  end: function() {
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

function request(method, path, options, callback) {
  var req = new MockRequest(method, path, options),
      res = new MockResponse
  Express.server.route(new Request(req, res))
  return res
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
  Express.params = {}
  delete Express.notFound
  delete Express.error
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
  return function(path, options, callback){
    if (options instanceof Function)
      callback = options, options = {}
    if (callback instanceof Function)
      Express.routes.push(new Route(method, path, callback, options))
    else
      return request(method, path, options, callback)
  }
}

// --- Mock routing API

get = view = route('get')
post = create = route('post')
del = destroy = route('delete')
put = update = route('put')