
// Express - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var Request = require('./request').Request,
    normalizePath = require('./request').normalizePath,
    multipart = require('old'),
    utils = require('./utils'),
    http = require('http'),
    sys = require('sys'),
    fs = require('fs')

Object.merge(global, require('./plugin'))
Object.merge(global, require('./dsl'))

// --- Route

Route = new Class({
  
  /**
   * Initialize a route with the given _method_,
   * _path_, and _callback_.
   *
   * The given _path_ becomes #originalPath, 
   * #path is then a normalized version converted
   * to a regular expression for routing.
   *
   * @param  {string} method
   * @param  {string} path
   * @param  {function} callback
   * @param  {hash} options
   * @api private
   */
  
  constructor: function(method, path, callback, options){
    this.method = method
    this.originalPath = path
    this.path = this.normalize(path)
    this.callback = callback
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
    return new RegExp('^' + RegExp.escape(normalizePath(path), '.')
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

Router = new Class({
  
  /**
   * Initialize with _request_ and parse url.
   *
   * @param  {Request} request
   * @api private
   */
  
  constructor: function(request) {
    this.request = request
    this.method = request.method.lowercase
  },
  
  /**
   * Evaluate the matched route against #request.
   *
   * @return {mixed}
   * @api private
   */
  
  route: function() { 
    var body, 
        route = this.matchingRoute()
    if (route) {
      body = route.callback.apply(this.request, this.request.captures.slice(1));
      if (this.request.passed) {
        if (typeof this.request.passed === 'string')
          this.request.url.pathname = this.request.passed
        this.request.passed = false
        return this.route()
      }
      return body
    }
    else
      this.request.notFound()
  },
  
  /**
   * Attempt to match a route from Express.routes.
   *
   * @return {Route}
   * @api private
   */
  
  matchingRoute: function() {
    this.lastMatchingRoute = this.lastMatchingRoute || 0
    var routes = Express.routes, route
    while (route = routes[this.lastMatchingRoute++]) 
      if (this.match(route))
        break
    return route
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
    if (this.method === route.method)
      if (this.request.captures = this.request.url.pathname.match(route.path)) {
        this.mapParams(route)
        return true
      }
  },
  
  /**
   * Map #request.captures to #request.params.path based on the
   * given _route_ params.
   *
   * @param  {Route} route
   * @api private
   */
  
  mapParams: function(route) {
    route.keys.each(function(key, i){
      var val = this.request.captures[++i]
      if (key in Express.params)
        if ((val = Express.params[key].call(this.request, val)) === false)
          this.request.passed = true
      this.request.params.path[key] = this.request.captures[i] = val
    }, this)
  }
})

// --- Server

Server = new Class({
  
  /**
   * Default port number.
   */
  
  port: 3000,
  
  /**
   * Default host ip, when null node will accept requests on 
   * all network addresses.
   */
  
  host: null,
  
  /**
   * Run Express with optional _port_ defaulting to 3000,
   * and host defaulting to null (INADDR_ANY).
   *
   * @param  {int} port
   * @param  {string} host
   * @return {Server}
   * @see run()
   * @api private
   */
  
  run: function(port, host){
    var self = this
    if (host !== undefined) this.host = host
    if (port !== undefined) this.port = port
    var server = http
      .createServer(function(req, response){
        var request, pendingFiles = 0
        req.setEncoding('binary')
        request = new Request(req, response)
        request.body = ''
        function callback(err) {
          if (err)
            request.error(err)
          else if (!pendingFiles)
            self.route(request)
        }
        if (request.header('Content-Type') &&
            request.header('Content-Type').includes('multipart/form-data')) {
          var stream,
              contentLength = parseInt(request.header('Content-Length')),
              maxBodyLength = set('max upload size')
          if (maxBodyLength && contentLength > maxBodyLength)
            return callback(new Error('upload size limit exceeded'))
          stream = multipart.parse(req)
          stream
            .addListener('partBegin', function(part) {
              if (part.filename)
                ++pendingFiles,
                part.tempfile = '/tmp/express-' + Date.now() + utils.uid(),
                part.fileStream = fs.createWriteStream(part.tempfile),
                part.fileStream.addListener('error', callback)
              else
                part.buf = ''
            })
            .addListener('body', function(chunk) {
              if (stream.part.fileStream)
                stream.part.fileStream.write(chunk, 'binary')
              else
                stream.part.buf += chunk
            })
            .addListener('partEnd', function(part) {
              if (!part.name) return
              if (part.fileStream)
                part.fileStream.end(function(){
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
          req
            .addListener('data', function(chunk){ request.body += chunk })
            .addListener('end', callback)
      })
    server.listen(this.port, this.host)
    sys.puts('Express started at http://' + (this.host || '*') + ':' + this.port + '/ in ' + Express.environment + ' mode')
    return server
  },
  
  /**
   * Route the given _request_.
   *
   * @param  {Request} request
   * @api private
   */
  
  route: function(request){ 
    var self = this
    request.trigger('request', function(err) {
      try { 
        if (err) throw err
        if (request.response.finished) return
        if (typeof (body = (new Router(request)).route()) === 'string')
          request.respond(200, body)
      } catch (err) {
        request.error(err)
      }
    })
  }
})

// --- Express

Express = { 
  version: '0.14.1',
  config: [],
  routes: [],
  plugins: [],
  settings: {},
  params: {},
  server: new Server
}

// --- Defaults

configure(function(){
  use(require('./plugins/view').View)
  use(require('./plugins/cache').Cache)
  use(require('./plugins/redirect').Redirect)
  use(require('./plugins/body-decoder').BodyDecoder)
})

configure('development', function(){
  enable('helpful 404')
  enable('show exceptions')
  enable('dump exceptions')
})

configure('test', function(){
  enable('throw exceptions')
  disable('dump exceptions')
})

configure('production', function(){
  enable('cache view contents')
  enable('cache view partials')
  enable('cache static files')
})
