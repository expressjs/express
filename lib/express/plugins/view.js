
// Express - View - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var utils = require('express/utils'),
    extname = require('path').extname,
    fs = require('fs')

/**
 * Cache supported template engine exports.
 */

var engines = {}

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
        
      // Request
      
      Request.include({
        
        /**
         * Render _view_ partial with _options_.
         * View Request#render() for additional options.
         *
         * Options:
         *   - collection:  Array of objects, the name is derived from
         *                  the view name itself. For example 'video.haml.html'
         *                  will have an object "video" available to it.
         *
         * @param  {string} view
         * @param  {hash} options
         * @return {string}
         * @api public
         */
        
        partial: function(view, options) {
          var options = options || {}
          options.partial = true
          options.layout = false
          if (options.collection) {
            var name = view.split('.').first
            options.locals = options.locals || {}
            return options.collection.map(function(val){
              options.locals[name] = val
              return this.render('partials/' + view, options)
            }, this).join('')
          } else
            return this.render('partials/' + view, options)
        },

        /**
         * Render _view_ with _options_.
         *
         * Views are looked up relative to the'views' path setting. 
         * View filenames should conform to ANY.ENGINE.TYPE so for example
         * 'layout.ejs.html', 'ejs' represents the template engine, 'html'
         * represents the type of content being rendered, which is then passed
         * to contentType().
         *
         * Engines must export a render() method accepting the template string
         * and a hash of options.
         *
         * Options:
         *
         *  - layout:   The layout to use, none when falsey. Defaults to 'layout'
         *  - locals:   Most engines support a hash of local variable names / values.
         *  - context:  Most engines support an evaluation context (the 'this' keyword). 
         *              Defaults to the current Request instance.
         *
         * @param  {string} view
         * @param  {hash} options
         * @settings 'views', 'cache view contents'
         * @api public
         */

        render: function(view, options) {
          var self = this,
              options = options || {},
              partial = options.partial,
              path = set('views') + '/' + view,
              type = path.split('.').slice(-2)[0],
              ext = extname(path),
              layout = options.layout === undefined ? 'layout' : options.layout
          options.context = options.context || this
          if (!partial) self.contentType(ext)
          function render(content) {
            content = (engines[type] = engines[type] || require(type)).render(content, options)
            if (layout)
              self.render(layout + '.' + type + ext, utils.mixin(true, options, {
                layout: false,
                locals: {
                  body: content
                }
              }))
            else if (partial)
              return content
            else
              self.halt(200, content)
          }
          function renderFromDisc() {
            if (partial) return render(fs.readFileSync(path))
            fs.readFile(path, function(err, content){
              if (err) throw err
              set('cache view contents')
                ? self.cache.set('view:' + path, content, function(cache){
                    render(cache)
                  })
                : render(content)
            })
          }
          if (set('cache view contents'))
            self.cache.get('view:' + path, function(cache){
              if (cache) return render(cache)
              else return renderFromDisc()
            })
          else
            return renderFromDisc()
        }
      })
    }
  }
})

