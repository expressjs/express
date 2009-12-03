
// Express - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

process.mixin(require('sys'))
process.mixin(require('express/helpers'))

// --- ExpressError

ExpressError = Class({
  name: 'ExpressError',
  init: function(message) {
    this.message = message
  },
  toString: function() {
    return this.name + ': ' + this.message
  }
})

// --- Route

Route = Class({
  init: function(method, path, fn, options){
    this.method = method
    this.originalPath = path
    this.path = pathToRegexp(normalizePath(path))
    this.fn = fn
  },
  run: function(){
    return this.fn()
  }
})

// --- Router

NotFoundError = ExpressError.extend({
  name: 'NotFoundError',
  init: function(request) {
    this.message = 'failed to find ' + request.method + ' ' + jsonEncode(request.uri.path)
  }
})

Router = Class({
  params: {},
  captures: [],
  route: function(request){
    this.request = request
    return this.matchingRoute().run()
  },
  
  matchingRoute: function(){
    for (var i = 0, len = Express.routes.length; i < len; ++i)
      if (this.match(Express.routes[i]))
        return Express.routes[i]
    throw new NotFoundError(this.request)
  },
  
  /**
   * Check if _route_ matches the current request.
   *
   * @param  {object} route
   * @return {bool}
   * @api private
   */

  match: function(route) {
    if (this.request.method.toLowerCase() == route.method)
      if (this.captures = this.request.uri.path.match(route.path)) {
        this.mapParams()
        return true
      }
  },
  
  mapParams: function() {
    for (var i = 0, len = keys.length; i < len; ++i)
      this.params[keys[i]] = this.captures[i+1]
  }
})

// --- Server

Server = Class({
  port: 3000,
  host: 'localhost',
  router: new Router,
  run: function(host, port){
    var self = this
    if (host) this.host = host
    if (port) this.port = port
    require('http')
      .createServer(function(request, response){
        request.addListener('body', function(chunk){ request.body += chunk })
        request.addListener('complete', function(){ self.route(request, response) })
      })
      .listen(this.port, this.host)
    puts('Express started at http://' + this.host + ':' + this.port + '/')
  },
  route: function(request, response){
    this.request = request, this.response = response
    this.request.uri.path = normalizePath(this.request.uri.path)
    if (typeof (this.response.body = this.router.route(request)) == 'string')
      this.respond()
  },
  respond: function(body){
    if (body) this.response.body = body
    this.response.sendHeader(this.response.status || 404, this.response.headers || {})
    this.response.sendBody(this.response.body || '')
    this.response.finish()
  }
})

// --- Express

Express = { 
  version: '0.0.1',
  routes: [],
  settings: {},
  server: new Server
}

// --- Helpers

function normalizePath(path) {
  return path.replace(/[\s\/]*$/g, '')
}

/**
 * Return a routing function for _method_.
 *
 * @param  {string} method
 * @return {function}
 * @api private
 */

function route(method) {
  return function(path, options, fn){
    if (options instanceof Function)
      fn = options, options = {}
    Express.routes.push(new Route(method, path, fn, options))
  }
}

/**
 * Normalize _path_. When a RegExp it is simply returned,
 * otherwise a string is converted to a regular expression
 * surrounded by ^$. So /user/:id/edit would become:
 *
 * \^/user/(.*?)\/edit\$/
 *
 * Each param key (:id) will be captured and placed in the
 * params array, so param('id') would give the string captured.
 *
 * The following are valid routes:
 *
 *  - /user/:id
 *  - /user/:id?
 *  - /report.:format
 *
 * @param  {string} path
 * @return {regexp}
 * @api private
 */

var keys
function pathToRegexp(path) {
  if (path instanceof RegExp) return path
  keys = []
  return new RegExp('^' + 
    escapeRegexp(path
    .replace(/\/:(\w+)\?/g, function(_, key){
      keys.push(key)
      return '(?:\/(.*?))?'
    })
    .replace(/:(\w+)/g, function(_, key){
      keys.push(key)
      return '(.*?)'
    }), '/ [ ]') + '$', 'i')
}

/**
 * Escape RegExp _chars_ in _string_. Where _chars_ 
 * defaults to regular expression special characters.
 *
 * _chars_ should be a space delimited list of characters,
 * for example '[ ] ( )'.
 *
 * @param  {string} string
 * @param  {string} chars
 * @return {Type}
 * @api public
 */

escapeRegexp = function(string, chars) {
  var specials = (chars || '/ . * + ? | ( ) [ ] { } \\').split(' ').join('|\\')
  return string.replace(new RegExp('(\\' + specials + ')', 'g'), '\\$1')
}

set = function(option, val) {
  return val == undefined ?
    Express.settings[option] :
      Express.settings[option] = val
}

enable = function(option) {
  set(option, true)
}

disable = function(option) {
  set(option, false)
}

run = function() {
  Express.server.run()
}

// --- Routing API

get = view = route('get')
post = create = route('post')
del = destroy = route('delete')
put = update = route('put')
