
// Express - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

process.mixin(require('sys'))
process.mixin(require('express/exceptions'))
process.mixin(require('express/helpers'))
process.mixin(require('express/mime'))
process.mixin(require('express/dsl'))

// --- Route

Route = Class({
  
  /**
   * Initialize a route with the given _method_,
   * _path_, and callback _fn_.
   *
   * The given _path_ becomes #originalPath, 
   * #path is then a normalized version converted
   * to a regular expression for routing.
   *
   * @param  {string} method
   * @param  {string} path
   * @param  {function} fn
   * @param  {hash} options
   * @api private
   */
  
  init: function(method, path, fn, options){
    this.method = method
    this.originalPath = path
    this.path = this.normalize(normalizePath(path))
    this.fn = fn
  },
  
  /**
   * Execute this route's #fn returning
   * it's return value.
   *
   * @return {mixed}
   * @api private
   */
  
  run: function(){
    return this.fn()
  },
  
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
   *  - /user/:id         Ex: '/user/12'
   *  - /user/:id?        Ex: '/user', '/user/12'
   *  - /report.:format   Ex: '/report.pdf', 'report.csv'
   *
   * @param  {string} path
   * @return {regexp}
   * @api private
   */

  normalize: function(path) {
    var self = this
    this.keys = []
    if (path instanceof RegExp) return path
    return new RegExp('^' + 
      escapeRegexp(path
      .replace(/\/:(\w+)\?/g, function(_, key){
        self.keys.push(key)
        return '(?:\/(.*?))?'
      })
      .replace(/:(\w+)/g, function(_, key){
        self.keys.push(key)
        return '(.*?)'
      }), '/ [ ]') + '$', 'i')
  }
})

// --- Router

Router = Class({
  
  /**
   * Parameter hash.
   */
  
  params: {},
  
  /**
   * Route match captures array.
   */
  
  captures: [],
  
  /**
   * Route the given _request_, returning
   * the value returned by Route#run()
   *
   * @param  {object} request
   * @return {mixed}
   * @api private
   */
  
  route: function(request){
    this.request = request
    return this.matchingRoute().run()
  },
  
  /**
   * Attempt to match a route from Express.routes.
   * Failure to do so will throw a NotFoundError.
   *
   * @return {Route}
   * @api private
   */
  
  matchingRoute: function(){
    for (var i = 0, len = Express.routes.length; i < len; ++i)
      if (this.match(Express.routes[i]))
        return Express.routes[i]
    throw new NotFoundError(this.request)
  },
  
  /**
   * Check if _route_ matches the current request.
   * If so populate #captures and #params.
   *
   * @param  {object} route
   * @return {bool}
   * @api private
   */

  match: function(route) {
    if (this.request.method.toLowerCase() == route.method)
      if (this.captures = this.request.uri.path.match(route.path)) {
        this.mapParams(route)
        return true
      }
  },
  
  /**
   * Map #captures to #params based on the
   * given _route_ keys.
   *
   * @param  {Route} route
   * @api private
   */
  
  mapParams: function(route) {
    for (var i = 0, len = route.keys.length; i < len; ++i)
      this.params[route.keys[i]] = this.captures[i+1]
  }
})

// --- Server

Server = Class({
  port: 3000,
  host: 'localhost',
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
    response.headers = {}
    this.request = request, this.response = response
    this.request.uri.path = normalizePath(this.request.uri.path)
    if (typeof (this.response.body = Express.router.route(request)) == 'string')
      this.respond()
  },
  respond: function(body){
    if (body) this.response.body = body
    this.response.sendHeader(this.response.status || 404, this.response.headers || {})
    this.response.sendBody(this.response.body || '')
    this.response.finish()
  }
})

// --- Helpers

/**
 * Normalize the given _path_.
 * Strips trailing slashes and whitespace.
 *
 * @param  {string} path
 * @return {string}
 * @api private
 */

function normalizePath(path) {
  return path.replace(/[\s\/]*$/g, '')
}

// --- Express

Express = { 
  version: '0.0.1',
  routes: [],
  settings: {},
  server: new Server,
  router: new Router
}
