
// Express - Static - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var Request = require('express/request').Request,
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
         * Transfer static file at the given _path_. All _options_
         * are passed to fs.createReadStream().
         *
         * @param  {string} path
         * @param  {object} options
         * @return {Request}
         * @api public
         */

        sendfile: function(path, options) {
          if (path.indexOf('..') !== -1)
            Error.raise('InvalidPathError', "`" + path + "' is not a valid path")
          this.response.chunkedEncoding = true
          return this.stream(fs.createReadStream(path, options))
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