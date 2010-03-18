
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
          var cache,
              self = this,
              options = options || {},
              path = set('views') + '/' + view,
              type = path.split('.').slice(-2)[0],
              ext = extname(path),
              layout = options.layout === undefined ? 'layout' : options.layout
          options.context = options.context || this
          self.contentType(ext)
          function render(content) {
            content = (engines[type] = engines[type] || require(type)).render(content, options)
            if (layout)
              self.render(layout + '.' + type + ext, utils.mixin(true, options, {
                layout: false,
                locals: {
                  body: content
                }
              }))
            else
              self.halt(200, content)
          }
          if (set('cache view contents') && (cache = self.cache.get('view:' + path)))
            render(cache)
          else
            fs.readFile(path, function(err, content){
              if (err) throw err
              set('cache view contents')
                ? render(self.cache.set('view:' + path, content))
                : render(content)
            })
        }
      })
    }
  }
})

