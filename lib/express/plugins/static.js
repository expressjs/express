
// Express - Static - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var Request = require('./../request').Request,
    path = require('path'),
    fs = require('fs')
    
// --- Static

exports.Static = Plugin.extend({
  extend: {
    
    /**
     * Initialize routes and request extensions.
     *
     * Options:
     *
     *  - path   path from which to serve static files. Defaults to <root>/public
     *  - bufferSize  buffers size to use for streaming files. Defaults to 65536 (8kb)
     * 
     * @param  {hash} options
     * @api private
     */
    
    init: function(config) {
      config = config || {}
      config.path = config.path || set('root') + '/public'
      
      // Routes
      
      get('/public/*', function(file){
        this.sendfile(config.path + '/' + file)
      })
      
      // Request
      
      Request.include({
        
        /**
         * Transfer static file at the given _path_ with optional _callback_.
         * _options_ are passed to fs.createReadStream().
         *
         * @param  {string} path
         * @param  {object} options
         * @param  {function} callback
         * @return {Request}
         * @api public
         */

        sendfile: function(path, options, callback) {
          var self = this
          if (options instanceof Function)
            callback = options,
            options = {}
          else
            options = options || {}
          if (path.indexOf('..') !== -1)
            Error.raise('InvalidPathError', "`" + path + "' is not a valid path")
          fs.stat(path, function(err, stat){
            if (err)
              return 'errno' in err && err.errno === 2
                ? self.notFound()
                : self.error(err, callback)
            var etag = Number(stat.mtime)
            if (self.header('If-None-Match') && 
                self.header('If-None-Match') == etag)
              return self.respond(304, null)
            self.header('Content-Length', stat.size)
            self.header('ETag', etag)
            options.bufferSize = options.bufferSize
                              || config.bufferSize
                              || 65536
            if (stat.size > options.bufferSize)
              return self.stream(fs.createReadStream(path, options))
            fs.readFile(path, function(err, content){
              if (err) return self.error(err, callback)
              self.contentType(path)
              self.respond(200, content)
            })
          })
          return this
        },
        
        /**
         * Transfer static _file_ as an attachment.
         *
         * The basename of _file_ is used as the attachment _filename_ when
         * not explicitly passed.
         *
         * @param  {string} file
         * @param  {string} filename
         * @return {Request}
         * @api public
         */

        download: function(file, filename) {
          return this.attachment(filename || path.basename(file)).sendfile(file)
        }
      })
    }
  }
})