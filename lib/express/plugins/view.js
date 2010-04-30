
// Express - View - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var Request = require('express/request').Request,
    extname = require('path').extname,
    fs = require('fs')

/**
 * Cache supported template engine exports.
 */

var engines = {}

/**
 * View cache.
 */
 
var cache = { views: {}, partials: {}}

/**
 * Cache view files where _type_ is
 * "partials" or "views".
 *
 * @param  {string} type
 * @api public
 */

function cacheFiles(type) {
  var dir = set(type)
  try {
    fs.readdirSync(dir).each(function(file){
      file = dir + '/' + file
      if (!fs.statSync(file).isFile()) return
      cache[type][file] = fs.readFileSync(file)
    })
  } catch (e) {
    if (e.errno !== process.ENOENT) throw e
  }
}

// --- View

exports.View = Plugin.extend({
  extend: {
    
    /**
     * Initialize extensions.
     */
    
    init: function() {
      
      // Settings
      
      if (!set('views'))
        set('views', function(){ return set('root') + '/views' })
        
      if (!set('partials'))
        set('partials', function(){ return set('views') + '/partials' })
        
      // Cache views in memory
      
      if (set('cache view contents'))
        cacheFiles('views')
        
      if (set('cache view partials'))
        cacheFiles('partials')
      
      // Request
      
      Request.include({
        
        /**
         * Render _view_ partial with _options_.
         * View Request#render() for additional options.
         *
         * Options:
         *   - as:          String name for the id used to which "collection" assign it's current value.
         *   - collection:  Array of objects, the name is derived from
         *                  the view name itself. For example 'video.haml.html'
         *                  will have an object "video" available to it.
         *
         * @param  {string} view
         * @param  {hash} options
         * @settings 'partials', 'cache view partials'
         * @return {string}
         * @api public
         */
        
        partial: function(view, options) {
          var options = options || {}
          options.partial = true
          options.layout = false
          if (options.collection) {
            var name = options.as || view.split('.').first,
                len = options.collection.length
            options.locals = options.locals || {}
            options.locals.__length__ = len
            return options.collection.map(function(val, i){
              options.locals.__isFirst__ = i === 0
              options.locals.__index__ = i
              options.locals.__isLast__ = i === len - 1
              options.locals[name] = val
              return this.render(view, options)
            }, this).join('')
          } else
            return this.render(view, options)
        },

        /**
         * Render _view_ with _options_.
         *
         * Views are looked up relative to the'views' path setting. 
         * View filenames should conform to NAME.TYPE.ENGINE so for example
         * 'layout.html.ejs', 'ejs' represents the template engine, 'html'
         * represents the type of content being rendered, which is then passed
         * to contentType().
         *
         * Engines must export a render() method accepting the template string
         * and a hash of options. Engines can respond to the options listed below
         * as well as their own arbitrary ones. The "filename" option is always
         * passed as the path to the given _view_, allowing engines to perform
         * better error reporting.
         *
         * Options:
         *
         *  - encoding: Passed to Request#respond()
         *  - layout:   The layout to use, none when falsey. Defaults to 'layout'
         *  - locals:   Most engines support a hash of local variable names / values.
         *  - context:  Most engines support an evaluation context (the 'this' keyword). 
         *              Defaults to the current Request instance.
         *
         * Optionally you may also pass a _callback_ function which
         * will be called instead of responding with the 200 status code.
         *
         * @param  {string} view
         * @param  {object} options
         * @param  {function} callback
         * @settings 'views', 'cache view contents'
         * @api public
         */

        render: function(view, options, callback) {
          var options = options || {},
              type = options.partial ? 'partials' : 'views',
              path = set(type) + '/' + view,
              parts = view.split('.'),
              engine = parts.last,
              contentType = parts.slice(-2)[0],
              layout = options.layout === undefined ? 'layout' : options.layout
          options.filename = path
          if (set('cache view contents'))
            options.cache = true
          var content = cache[type][path] || fs.readFileSync(path)
          options.context = options.context || this
          content = (engines[engine] = engines[engine] || require(engine)).render(content, options)
          if (type === 'views') this.contentType(contentType)
          if (layout)
            this.render([layout, contentType, engine].join('.'), Object.mergeDeep(options, {
              layout: false,
              locals: { body: content }
            }), callback)
          else if (type === 'partials')
            return content
          else if (callback)
            callback.call(this, null, content)
          else
            this.respond(200, content, options.encoding)
        }
      })
    }
  }
})

