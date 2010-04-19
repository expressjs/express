
// Express - Static - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var Request = require('express/request').Request,
    path = require('path'),
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
    if (path.indexOf('..') !== -1)
      Error.raise('InvalidPathError', "`" + path + "' is not a valid path")
  },
  
  /**
   * Transfer static file to the given _request_.
   *
   * @param  {Request} request
   * @api public
   */
  
  sendTo: function(request) {
    // function sendFromDisc() {
    //   path.exists(file, function(exists){
    //     if (!exists) return request.notFound()
    //     fs.stat(file, function(err, stats){
    //       if (err) throw err
    //       if (!stats.isFile()) return request.notFound()
    //       fs.readFile(file, 'binary', function(err, content){
    //         if (err) throw err
    //         request.contentType(file)
    //         if (set('cache static files'))
    //           request.cache.set('static:' + file, { type: file, content: content })
    //         request.halt(200, content, 'binary')
    //       })
    //     })
    //   })
    // }
    // if (set('cache static files'))
    //   request.cache.get('static:' + file, function(cache){
    //     if (cache) 
    //       request.contentType(cache.type),
    //       request.halt(200, cache.content, 'binary')
    //     else
    //       sendFromDisc()
    //   })
    // else
    //   sendFromDisc()
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
          if (path.indexOf('..') !== -1)
            Error.raise('InvalidPathError', "`" + path + "' is not a valid path")
          this.response.chunkedEncoding = true
          return this.stream(fs.createReadStream(path))
        },
        
        /**
         * Transfer static _file_ as an attachment.
         * The basename of _file_ is used as the attachment filename.
         *
         * @param  {string} file
         * @return {Request}
         * @api public
         */

        download: function(file) {
          return this.attachment(path.basename(file)).sendfile(file)
        }
      })
    }
  }
})