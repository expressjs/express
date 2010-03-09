
// Express - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var multipart = require('multipart'),
    utils = require('express/utils'),
    events = require('events'),
    fs = require('fs')

utils.mixin(require('sys'))
utils.mixin(require('express/exceptions'))
utils.mixin(require('express/collection'))
utils.mixin(require('express/event'))
utils.mixin(require('express/request'))
utils.mixin(require('express/plugin'))
utils.mixin(require('express/dsl'))

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
    this.path = this.normalize(path)
    this.fn = fn
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
   *  - /public/*         Ex: '/public/app.js', '/public/javascripts/app.js'
   *  - /public/*.*       Ex: '/public/app.js', '/public/javascripts/app.js'
   *
   * @param  {string} path
   * @return {regexp}
   * @api private
   */

  normalize: function(path) {
    var self = this
    this.keys = []
    if (path instanceof RegExp) return path
    return new RegExp('^' + utils.escapeRegexp(normalizePath(path), '.')
      .replace(/\*/g, '(.+)')
      .replace(/(\/|\\\.):(\w+)\?/g, function(_, c, key){
        self.keys.push(key)
        return '(?:' + c + '([^\/]+))?'
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
   * Initialize with _request_ and parse url.
   *
   * @param  {Request} request
   * @api private
   */
  
  init: function(request) {
    this.request = request
  },
  
  /**
   * Evaluate the matched route against #request.
   *
   * @return {mixed}
   * @api private
   */
  
  route: function(){
    var route = this.matchingRoute()
    if (route)
      return route.fn.apply(this.request, this.request.captures.slice(1))
    else if (this.request.accepts('html') && set('helpful 404'))
      this.request.halt(404, require('express/pages/not-found').render(this.request))
    else
      this.request.halt()
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
      if (this.request.captures = this.request.url.pathname.match(route.path)) {
        this.mapParams(route)
        return true
      }
  },
  
  /**
   * Map #request.captures to #request.params.path based on the
   * given _route_ keys.
   *
   * @param  {Route} route
   * @api private
   */
  
  mapParams: function(route) {
    var self = this
    $(route.keys).each(function(key, i){
      self.request.params.path[key] = self.request.captures[++i]
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
   * Default host ip, when null node will accept requests on 
   * all network addresses.
   */
  
  host: 'localhost',
  
  /**
   * Maximum number of queued connections.
   */
  
  backlog: 128,
  
  /**
   * Run Express.
   *
   *  - Buffers request bodies
   *  - Calls #route() once the request is complete
   *
   * @param  {int} port
   * @param  {string} host
   * @param  {int} backlog
   * @see run()
   * @api private
   */
  
  run: function(port, host, backlog){
    var self = this
    this.running = true
    if (host !== undefined) this.host = host
    if (port !== undefined) this.port = port
    if (backlog !== undefined) this.backlog = backlog
    require('http')
      .createServer(function(request, response){
        request.body = ''
        request.setBodyEncoding('binary')
        var pendingFiles = 0
        function callback(e, result) {
          if (!e) {
            if (!pendingFiles) self.route(request, response)
          }
          else
            self.error(e, request, response)
        }
        if (request.headers['content-type'] &&
            request.headers['content-type'].indexOf('multipart/form-data') !== -1) {
          var stream = multipart.parse(request)
          request.params = { post: {}}
          stream
            .addListener('partBegin', function(part) { 
              if (part.filename)
                ++pendingFiles,
                part.tempfile = '/tmp/express-' + Number(new Date) + utils.uid(),
                part.fileStream = fs.createWriteStream(part.tempfile)
              else
                part.buf = ''
            })
            .addListener('body', function(chunk) {
              if (stream.part.fileStream)
                stream.part.fileStream.write(chunk)
              else
                stream.part.buf += chunk
            })
            .addListener('partEnd', function(part) {
              if (!part.name) return
              if (part.fileStream)
                part.fileStream.close(function(){
                  --pendingFiles
                  callback()
                }),
                utils.mergeParam(part.name, { filename: part.filename, tempfile: part.tempfile }, request.params.post)                    
              else
                utils.mergeParam(part.name, part.buf, request.params.post)                    
            })
            .addListener('error', callback)
            .addListener('complete', callback)
        }
        else
          request
            .addListener('data', function(chunk){ request.body += chunk })
            .addListener('end', callback)
      })
      .listen(this.port, this.host, this.backlog)
    puts('Express started at http://' + this.host + ':' + this.port + '/ in ' + Express.environment + ' mode')
  },
  
  /**
   * Route the given _request_ and _response_.
   *
   * @param  {object} request
   * @param  {object} response
   * @api private
   */
  
  route: function(request, response){
    request = new Request(request, response)
    request.trigger('request')
    if (request.response.finished) return
    try {
      if (typeof (body = (new Router(request)).route()) == 'string')
        request.halt(200, body)
    }
    catch (e) {
      this.error(e, request)
    }
  },
  
  /**
   * Handle errors
   * @param {object} e
   * @param  {object} request
   * @param  {object} response
   * @api private
   */
  error: function (e, request, response) {
    if (e instanceof ExpressError)
      throw e
    if (!(request instanceof Request))
      request = new Request(request, response),
      request.trigger('request')
    if (request.accepts('html') && set('show exceptions'))
      request.halt(500, require('express/pages/show-exceptions').render(request, e))
    else
      request.halt(500)
    if (set('throw exceptions'))
      throw e
  }
})

// --- Express

Express = { 
  version: '0.4.0',
  config: [],
  routes: [],
  plugins: [],
  settings: {},
  server: new Server
}

// --- Defaults

configure(function(){
  use(require('express/plugins/view').View)
  use(require('express/plugins/cache').Cache)
  use(require('express/plugins/redirect').Redirect)
  use(require('express/plugins/body-decoder').BodyDecoder)
})

configure('development', function(){
  enable('helpful 404')
  enable('show exceptions')
})

configure('test', function(){
  enable('throw exceptions')
})

configure('production', function(){
  enable('cache view contents')
  enable('cache static files')
})
