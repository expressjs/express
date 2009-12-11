
// Express - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

process.mixin(require('sys'))
process.mixin(require('express/exceptions'))
process.mixin(require('express/collection'))
process.mixin(require('express/helpers'))
process.mixin(require('express/plugin'))
process.mixin(require('express/mime'))
process.mixin(require('express/view'))
process.mixin(require('express/dsl'))

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

// --- Route

Route = Class({
  
  /**
   * Path match captures.
   */
   
   keys: [],
  
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
    this.path = this.normalize(path)
    this.fn = fn
  },
  
  /**
   * Execute this route's #fn with _args_,
   * returning it's return value.
   *
   * @param  {mixed} args ...
   * @return {mixed}
   * @api private
   */
  
  run: function() {
    return this.fn.apply(GLOBAL, arguments)
  },
  
  /**
   * Normalize _path_. When a RegExp it is simply returned,
   * otherwise a string is converted to a regular expression
   * surrounded by ^$. So /user/:id/edit would become:
   *
   * /^\/user\/([^\/]+)\/edit$/i
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
    return new RegExp('^' + normalizePath(path)
      .replace(/\/:(\w+)\?/g, function(_, key){
        self.keys.push(key)
        return '(?:\/([^\/]+))?'
      })
      .replace(/:(\w+)/g, function(_, key){
        self.keys.push(key)
        return '([^\/]+)'
      }) + '$', 'i')
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
    var route = this.matchingRoute()
    return route ? route.run(this.captures.slice(1)) : halt()
  },
  
  /**
   * Attempt to match a route from Express.routes.
   *
   * @return {Route}
   * @api private
   */
  
  matchingRoute: function(){
    var self = this
    return $(Express.routes).find(function(route){
      return self.match(route)
    })
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
    var self = this
    $(route.keys).each(function(key, i){
      self.params[key] = self.captures[++i]
    })
  }
})

// --- Server

Server = Class({
  
  /**
   * Default port number.
   */
  
  port: 3000,
  
  /**
   * Default host ip.
   */
  
  host: 'localhost',
  
  /**
   * Run Express at _host_ and _port_, otherwise
   * falling back on the defaults.
   *
   *  - Buffers request bodies
   *  - Calls #route() once the request is complete
   *
   * @param  {string} host
   * @param  {int} port
   * @see run()
   * @api private
   */
  
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
  
  /**
   * Route the given _request_ and _response_.
   *
   *  - Defaults response headers to {}
   *  - Normalizes the request path to prep for matching routes
   *  - Invokes Express.router.route() to do its job
   *  - Responds immediately if the route returns a body string
   *
   * @param  {object} request
   * @param  {object} response
   * @api private
   */
  
  route: function(request, response){
    var body 
    response.headers = {}
    this.request = request, this.response = response
    this.request.uri.path = normalizePath(this.request.uri.path)
    this.request.uri.params = parseNestedParams(this.request.uri.params)
    trigger('request')
    if (typeof (body = Express.router.route(request)) == 'string')
      halt(200, body)
  },
  
  /**
   * Respond immediately with optional _body_.
   *
   * @param  {string} body
   * @api private
   */
  
  respond: function(body){
    this.response.body = body, trigger('response')
    if (typeof this.response.body != 'string') throw new InvalidResponseBody(this.request)
    if (typeof this.response.status != 'number') throw new InvalidStatusCode(this.response.status)
    this.response.sendHeader(this.response.status, this.response.headers)
    this.response.sendBody(this.response.body)
    this.response.finish()
  }
})

// --- Express

Express = { 
  version: '0.0.1',
  config: [],
  routes: [],
  plugins: [],
  settings: {},
  server: new Server,
  router: new Router
}

// --- Defaults

configure(function(){
  set('views', function(){ return set('root') + '/views' })
})
