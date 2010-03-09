
// Express - Static - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var path = require('path'),
    fs = require('fs')
    
// --- InvalidPathError

InvalidPathError = ExpressError.extend({
  name: 'InvalidPathError',
  init: function(path) {
    this.message = "`" + path + "' is not a valid path"
  }
})  
  
// --- File

exports.File = Class({
  
  /**
   * Initialize with file _path_.
   *
   * @param  {string} path
   * @api public
   */
  
  init: function(path) {
    this.path = path
    if (path.indexOf('..') != -1) throw new InvalidPathError(path)
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
  
  send: function(request) {
    var cache, file = this.path
    if (set('cache static files') && (cache = request.cache.get(file)))
      return request.contentType(cache.type),
             request.halt(200, cache.content, 'binary')
    path.exists(file, function(exists){
      if (!exists) return request.halt()
      fs.stat(file, function(e, stats){
        if (e) throw e
        if (!stats.isFile()) return request.halt()
        fs.readFile(file, 'binary', function(e, content){
          if (e) throw e
          request.contentType(file)
          if (set('cache static files'))
            request.cache.set(file, { type: file, content: content })
          request.halt(200, content, 'binary')
        })
      })
    })
  }
})