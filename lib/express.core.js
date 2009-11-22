
// Express - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

(function(){
  var http = require("http");
  process.mixin(GLOBAL, require("sys"));
  
  Express = { 
    version : '0.0.1',
    utilities : {},
    modules  : [],
    routes  : [],
    STATUS_CODES : {
      100 : 'Continue',
      101 : 'Switching Protocols',
      200 : 'OK',
      201 : 'Created',
      202 : 'Accepted',
      203 : 'Non-Authoritative Information',
      204 : 'No Content',
      205 : 'Reset Content',
      206 : 'Partial Content',
      300 : 'Multiple Choices',
      301 : 'Moved Permanently',
      302 : 'Moved Temporarily',
      303 : 'See Other',
      304 : 'Not Modified',
      305 : 'Use Proxy',
      400 : 'Bad Request',
      401 : 'Unauthorized',
      402 : 'Payment Required',
      403 : 'Forbidden',
      404 : 'Not Found',
      405 : 'Method Not Allowed',
      406 : 'Not Acceptable',
      407 : 'Proxy Authentication Required',
      408 : 'Request Time-out',
      409 : 'Conflict',
      410 : 'Gone',
      411 : 'Length Required',
      412 : 'Precondition Failed',
      413 : 'Request Entity Too Large',
      414 : 'Request-URI Too Large',
      415 : 'Unsupported Media Type',
      500 : 'Internal Server Error',
      501 : 'Not Implemented',
      502 : 'Bad Gateway',
      503 : 'Service Unavailable',
      504 : 'Gateway Time-out',
      505 : 'HTTP Version not supported'
    },
    
    // --- Halt
    
    Halt : function(){
      this.toString = function() {
        return 'Express.Halt'
      }
    },
    
    // --- Response
    
    response : {
      headers : {},
      cookie : {}
    },
    
    // --- Settings
    
    settings : {
      basepath : '/',
      defaultRoute : {
        callback : function() {
          Express.respond('Page or file cannot be found', 'Not Found')
        }
      }
    },
    
    // --- Modules
    
    RedirectHelpers : {
      init : function() {
        Express.home = Express.settings.basepath
      },
      
      onRequest : {
        'set back to referrer' : function() {
          Express.back = 
            Express.requestHeader('Referer') ||
              Express.requestHeader('Referrer')
        }
      }
    },
    
    ContentLength : {
      onResponse : {
        'set content length' : function() {
          Express.header('Content-Length', (Express.response.body || '').length)
        }
      }
    },
    
    DefaultContentType : {
      onRequest : {
        'set response content type to text/html' : function() {
          Express.header('Content-Type', 'text/html')
        }
      }
    },
    
    BodyDecoder : {
      onRequest : {
        'parse urlencoded bodies' : function() {
          switch (Express.requestHeader('Content-Type')) {
            case 'application/x-www-form-urlencoded':
              Express.request.uri.params = Express.parseParams(unescape(Express.request.body))
              break
            
            case 'application/json':
              Express.request.uri.params = Express.jsonDecode(Express.request.body)
              break
          }
        }
      }
    },
    
    MethodOverride : {
      onRequest : {
        'set HTTP method to _method when present' : function() {
          if (method = Express.param('_method'))
            Express.request.method = method.toUpperCase()
        }
      }
    },
    
    Logger : {
      onRequest : {
        'output log data' : function(){
          puts('"' + Express.request.method + ' ' + Express.request.uri.path +
               ' HTTP/' + Express.request.httpVersion + '" - ' + Express.response.status)
        }
      }
    },
    
    /**
     * Invoke hook _name_ with _args_, returning
     * an array of return values.
     *
     * @param  {string} name
     * @param  {...} args
     * @return {array}
     * @api public
     */
    
    hook : function(name, args) {
      var results = []
      for (var i = 0, len = this.modules.length; i < len; ++i)
        for (var key in this.modules[i][name])
          results.push(this.modules[i][name][key].apply(this.modules[i], this.argsArray(arguments, 1))) 
      return results
    },
    
    /**
     * Invoke hook _name_ with _immutable_ and _args_, returning
     * the _immutable_ variable once modified by each hook implementation.
     * When implementing these hooks, the function must return a value.
     *
     * @param  {string} name
     * @param  {mixed} immutable
     * @param  {...} args
     * @return {mixed}
     * @api public
     */
    
    hookImmutable : function(name, immutable, args) {
      for (var i = 0, len = this.modules.length; i < len; ++i)
        for (var key in this.modules[i][name])
          immutable = this.modules[i][name][key].call(this.modules[i], immutable)
      return immutable
    },
    
    /**
     * Add _module_.
     *
     * @param  {hash} module
     * @param  {...} args
     * @api public
     */
    
    addModule : function(module, args) {
      Express.settings[module.name] = {}

      if ('init' in module) 
        module.init.apply(module, Express.argsArray(arguments, 1))

      if ('settings' in module) {
        if (!module.name) throw 'module name is required when using .settings'
        for (var name in module.settings)
          Express.settings[module.name][name] = module.settings[name]
      }
            
      if ('utilities' in module)
        for (var name in module.utilities)
          Express.utilities[name] = module.utilities[name]
      
      Express.modules.push(module)
    },
    
    /**
     * Start Express; binding to _host_ / _port_.
     *
     * @param {int} port
     * @param {string} host
     * @api public
     */
    
    start : function(port, host) {
      this.server.listen(port || 3000, host, this.server.callback)
    },
    
    server : {
      
      /**
       * Listen to _host_ / _port_ with _callback_.
       *
       * @param {int} port
       * @param {string} host
       * @param {function} callback
       * @api private
       */
      
      listen : function(port, host, callback) {
        http.createServer(callback).listen(port, host)
        puts('Express started at http://' + (host || '127.0.0.1') + ':' + port + '/')
      },
      
      /**
       * Request callback.
       *
       * @param  {object} request
       * @param  {object} response
       * @api private
       */
      
      callback : function(request, response){
        request.body = request.body || ''
        request.setBodyEncoding('utf8')
        request.addListener('body', function(chunk) { request.body += chunk })
        request.addListener('complete', function(){
          Express.home = Express.settings.basepath
          Express.response.body = null
          Express.response.status = 200
          Express.request = request
          request.headers = Express.arrayToHash(request.headers)
          request.uri.params = Express.parseNestedParams(request.uri.params)
          request.uri.path = Express.normalizePath(request.uri.path)
          Express.hook('onRequest')
          try { Express.response.body = Express.callRouteFor(request) }
          catch (e) { Express.fail(e) }
          Express.hook('onResponse')
          response.sendHeader(Express.response.status, Express.hashToArray(Express.response.headers))
          response.sendBody(Express.response.body || '')
          response.finish()
        })
      }
    },
    
    /**
     * Fail Express with exception _e_.
     *
     * @param  {object} e
     * @api private
     */

    fail : function(e) {
      this.hook('onFailure', e)
      if (e.constructor == Express.Halt) return
      this.header('Content-Type', 'text/plain')
      this.response.body = e.message ? e.name + ': ' + e.message : e.toString()
      this.response.status = 500
    },
    
    /**
     * Return an associative array generated
     * from the key / value pairs in _hash_.
     *
     * @param  {hash} hash
     * @return {array}
     * @api public
     */
    
    hashToArray : function(hash) {
      var array = []
      for (var key in hash)
        array.push([key, hash[key]])
      return array
    },
    
    /**
     * Return hash generated from an
     * associative array.
     *
     * @param  {array} array
     * @return {hash}
     * @api public
     */
    
    arrayToHash : function(array) {
      var hash = {}
      for (var i = 0, len = array.length; i < len; ++i)
        hash[array[i][0].toLowerCase()] = array[i][1]
      return hash
    },
    
    /**
     * JSON encode _object_
     *
     * @param  {mixed} object
     * @return {string}
     * @api public
     */
    
    jsonEncode : function(object) {
      return JSON.stringify(object)
    },
    
    /**
     * JSON decode _string_.
     *
     * @param  {string} string
     * @return {mixed}
     * @api public
     */
     
     jsonDecode : function(string) {
       return JSON.parse(string)
     },
     
    /**
     * Redirect to _uri_.
     *
     * @param  {string} uri
     * @api public
     */
    
    redirect : function(uri) {
      this.header('Location', uri)
      this.respond("Page or file has moved to `" + uri + "'", 'Moved Temporarily')
    },
    
    /**
     * Set response status to _value_. Where value may be
     * a case-insensitive string such as 'Not Found', 'forbidden',
     * or a numeric HTTP response status code.
     *
     * @param  {int, string} value
     * @return {int}
     * @api public
     */
    
    status : function(value) {
      if (value == undefined) return
      if (typeof value == 'number') return this.response.status = value
      for (var code in this.STATUS_CODES)
        if (this.STATUS_CODES[code].toLowerCase() == value.toLowerCase())
          return this.response.status = parseInt(code)
    },

    /**
     * Return path segment _n_.
     *
     * @param  {int} n
     * @return {string}
     * @api public
     */
    
    arg : function(n) {
      return this.request.uri.path.split('/')[n]
    },
    
    /**
     * Set response _status_ and _body_.
     *
     * @param  {string} body
     * @param  {string, int} status
     * @api public
     */
    
    respond : function(body, status) {
      this.response.body = body
      this.status(status)
      throw new Express.Halt()
    },
    
    /**
     * Get or set response _name_ header.
     *
     * @param  {string} name
     * @param  {string} value
     * @return {string}
     * @api public
     */
    
    header : function(name, value) {
      return value ? 
        this.response.headers[name.toLowerCase()] = value :
          this.response.headers[name.toLowerCase()]
    },
    
    /**
     * Get request header _name_ optionally providing _default_
     * when _name_ is not present.
     *
     * @param  {string} name
     * @param  {string} default
     * @return {string}
     * @api public
     */
    
    requestHeader : function(name, defaultValue) {
      return this.request.headers[name.toLowerCase()] || defaultValue
    },
        
    /**
     * Return param _key_'s value or _defaultValue_ when
     * the param has not been set.
     *
     * @param  {string} key
     * @param  {mixed} defaultValue
     * @return {mixed}
     * @api public
     */
    
    param : function(key, defaultValue) {
      return this.request.uri.params[key] || defaultValue
    },
    
    /**
     * Parse params _string_ into a nested hash.
     *
     * @param  {string} string
     * @return {hash}
     * @api public
     */
    
    parseParams : function(string) {
      var params = {}, pairs = string.split('&'), pair
      for (var i = 0, len = pairs.length; i < len; ++i) {
        pair = pairs[i].split('=')
        params[pair[0]] = pair[1]
      }
      return this.parseNestedParams(params)
    },
    
    /**
     * Parse _params_, splitting { user[info][name] : 'tj' } into
     * { user : { info : { name : 'tj' }}}
     *
     * @param  {hash} params
     * @return {hash}
     * @api public
     */
    
    parseNestedParams : function(params) {
      for (var key in params)
        if (parts = key.split('['))
          if (parts.length > 1)
            for (var i = 0, prop = params, len = parts.length; i < len; ++i) {
              var name = parts[i].replace(']', '')
              if (i == len - 1) {
                prop[name] = params[key]
                prop = params, delete params[key]
              }
              else {
                prop = prop[name] = prop[name] || {}
              }
            }
                
      return params
    },
    
    /**
     * Parse _cookie_ string into an object (hash).
     *
     * @param  {string} cookie
     * @return {hash}
     * @api public
     */
    
    parseCookie : function(cookie) {
      var hash = {}
      if (!cookie) return hash
      var attrs = cookie.split(/\s*;\s*/)
      for (var i = 0; i < attrs.length; ++i)
        hash[attrs[i].split('=')[0]] = unescape(attrs[i].split('=')[1])
      return hash
    },
    
    /**
     * Normalize a path. Strips trailing / leading whitespace
     * and slashes ('/').
     *
     * @param  {string} path
     * @return {string}
     * @api public
     */
    
    normalizePath : function(path) {
      if (typeof path != 'string') return path
      return path.replace(/^(\s|\/)*|(\s|\/)*$/g, '')
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
     * @param  {string} path
     * @return {regexp}
     * @api public
     */
    
    pathToRegexp : function(path) {
      Express.regexpKeys = []
      if (path.constructor == RegExp) return path
      path = path.replace(/:(\w+)/g, function(_, key){
        Express.regexpKeys.push(key)
        return '(.*?)'
      })
      return new RegExp('^' + this.escapeRegexp(path, '/ [ ]') + '$', 'i')
    },
    
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
    
    escapeRegexp : function(string, chars) {
      var specials = (chars || '/ . * + ? | ( ) [ ] { } \\').split(' ').join('|\\')
      return string.replace(new RegExp('(\\' + specials + ')', 'g'), '\\$1')
    },
    
    /**
     * Return the contents of a function body.
     *
     * @param  {function} body
     * @return {string}
     * @api public
     */
    
    contentsOf : function(body) {
      if (typeof body != 'function') throw "Express.contentsOf(): `" + body + "' is not a function"
      return body.toString().match(/^[^\{]*{((.*\n*)*)}/m)[1]
    },
    
    /**
     * Eval _string_ in context of Express.
     *
     * @param  {string} string
     * @return {mixed}
     * @api public
     */
    
    eval : function(string) {
      return eval('with (Express){ with (Express.utilities){ ' + string + '}}')
    },
        
    /**
     * Escape special characters in _html_.
     *
     * @param  {string} html
     * @return {string}
     * @api public
     */
    
    escape : function(html) {
      return html.
        replace(/&/g, '&amp;').
        replace(/"/g, '&quot;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;')
    },
    
    /**
     * Convert native arguments object into an
     * array with optional _offset_.
     *
     * @param  {arguments} args
     * @param  {int} offset
     * @return {array}
     * @api public
     */
    
    argsArray : function(args, offset) {
      return Array.prototype.slice.call(args, offset)
    },
    
    /**
     * Check if _route_ matches provides the proper
     * encoding types listed in _request_'s Accept header.
     *
     * @param  {hash} route
     * @param  {hash} request
     * @return {bool}
     * @api private
     */
    
    routeProvides : function(route, request) {
      if (!route.options.provides) return true
      if (route.options.provides.constructor != Array) 
        route.options.provides = [route.options.provides]
      for (var i = 0, len = route.options.provides.length; i < len; ++i)
        if (request.headers.accept && request.headers.accept.match(route.options.provides[i]))
          return true
      return false
    },
    
    /**
     * Attept to match and call a route for 
     * the given _request_, returning the data
     * returned by the route callback.
     *
     * @param  {object} request
     * @return {mixed}
     * @api private
     */
    
    callRouteFor : function(request) {
      var route = this.findRouteFor(request) || this.settings.defaultRoute
      if (route.keys)
        for (var i = 0, len = route.keys.length; i < len; ++i) 
          this.request.uri.params[route.keys[i]] = Express.captures[i+1] || null
      var body = this.eval(Express.contentsOf(route.callback))
      if (typeof body != 'string') 
        throw "route `" + route.method.toUpperCase() + ' ' + route.path + "' must return a string"
      return body
    },
    
    /**
     * Attemp to find and return a route matching _request_.
     *
     * @param  {object} request
     * @return {object}
     * @api private
     */
    
    findRouteFor : function(request) {
      for (var i = 0, len = this.routes.length; i < len; ++i)
        if (this.routeMatches(this.routes[i], request))
          return this.routes[i]
    },
    
    /**
     * Check if _route_ matches _request_
     *
     * @param  {object} route
     * @param  {object} request
     * @return {bool}
     * @api private
     */
    
    routeMatches : function(route, request) {
      if (request.method.toLowerCase() != route.method) return false
      switch (route.path.constructor) {
        case String: return route.path == request.uri.path
        case RegExp: return !! (Express.captures = request.uri.path.match(route.path))
      }
    },
    
    /**
     * Return a routing function for _method_.
     *
     * @param  {string} method
     * @return {function}
     * @api private
     */
    
    routeFunctionFor : function(method) {
      return function(path, options, callback) {
        if (options.constructor == Function) callback = options, options = {}
        path = Express.pathToRegexp(Express.normalizePath(path))
        var route = {
          keys : Express.regexpKeys,
          path : path,
          method : method,
          options : options,
          callback : callback
        }
        Express.routes.push(route)
        Express.hook('onRouteAdded', route)
      }
    }
  }
  
  // --- Expose
  
  get = Express.routeFunctionFor('get')
  post = Express.routeFunctionFor('post')
  del = Express.routeFunctionFor('delete')
  put = Express.routeFunctionFor('put')
  use = Express.addModule

  // --- Core Modules
  
  use(Express.BodyDecoder)
  use(Express.MethodOverride)
  use(Express.ContentLength)
  use(Express.DefaultContentType)
  use(Express.RedirectHelpers)
    
})()

get('user', function(){
  'Foo'
})

put('user', function(){
  p('PUT')
})

del('user', function(){
  p('DELETE')
})

// Express.start()
