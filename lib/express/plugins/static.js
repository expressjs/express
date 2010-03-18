
// Express - Static - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var path = require('path'),
    fs = require('fs')
    
// --- File

exports.File = new Class({
  
  /**
   * Initialize with file _path_.
   *
   * @param  {string} path
   * @api public
   */
  
  constructor: function(path) {
    this.path = path
    if (path.indexOf('..') != -1)
      Error.raise('InvalidPathError', "`" + path + "' is not a valid path")
  },
  
  /**
   * Transfer static file to the given _request_.
   *
   *  - Ensures the file exists
   *  - Ensures the file is a regular file (not FIFO, Socket, etc)
   *  - Automatically assigns content type
   *  - Halts with 404 when failing
   *
   * @param  {Request} request
   * @settings 'cache static files'
   * @api public
   */
  
  sendTo: function(request) {
    var cache, file = this.path
    if (set('cache static files') && (cache = request.cache.get('static:' + file)))
      return request.contentType(cache.type),
             request.halt(200, cache.content, 'binary')
    path.exists(file, function(exists){
      if (!exists) return request.halt()
      fs.stat(file, function(err, stats){
        if (err) throw err
        if (!stats.isFile()) return request.halt()
        fs.readFile(file, 'binary', function(err, content){
          if (err) throw err
          request.contentType(file)
          if (set('cache static files'))
            request.cache.set('static:' + file, { type: file, content: content })
          request.halt(200, content, 'binary')
        })
      })
    })
  }
})

// --- Static

exports.Static = Plugin.extend({
  extend: {
    
    /**
     * Initialize routes and request extensions.
     *
     * Options:
     *
     *  - path   path from which to serve static files. Defaults to <root>/public
     * 
     * @param  {hash} options
     * @api private
     */
    
    init: function(options) {
      options = options || {}
      options.path = options.path || set('root') + '/public'
      
      // Routes
      
      get('/public/*', function(file){
        this.sendfile(options.path + '/' + file)
      })
      
      // Request
      
      Request.include({
        
        /**
         * Transfer static file at the given _path_.
         *
         * @param  {string} path
         * @return {Request}
         * @api public
         */

        sendfile: function(path) {
          (new exports.File(path)).sendTo(this)
          return this
        }
      })
    }
  }
})