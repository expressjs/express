
// Express - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

process.mixin(GLOBAL, require('sys'))

// --- Route

Route = Class({
  init: function(method, path, fn, options){
    this.method = method
    this.path = path
    this.fn = fn
  },
  run: function(){
    return process.compile('with(Express.helpers){ (' + this.fn + ')() }', this.method + '("' + this.path + '")')
  }
})

// --- Router

Router = Class({
  route: function(request){
    this.request = request
    return this.matchingRoute().run()
  },
  
  matchingRoute: function(){
    for (var i = 0, len = Express.routes.length; i < len; ++i)
      if (this.match(Express.routes[i]))
        return Express.routes[i]
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
      return route.path == this.request.uri.path
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
  helpers: {},
  server: new Server
}

// --- Helpers
    
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

// --- Routing API

get = view = route('get')
post = create = route('post')
del = destroy = route('delete')
put = update = route('put')
