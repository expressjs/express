
// Express - View - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var posix = require('posix')

/**
 * Template content cache.
 */

var cache = {}

/**
 * Supported template engines.
 */

var engine = {
  ejs: require('support/ejs/ejs'),
  haml: require('support/haml/lib/haml')
}

// --- View

exports.View = Plugin.extend({
  extend: {
    
    /**
     * Initialize extensions.
     */
    
    init: function() {
      
      // Settings
      
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
         *  - layout:   Whether or not to use a layout. Defaults to true
         *  - context:  Most engines support an evaluation context (the 'this' keyword)
         *  - locals:   Most engines support a hash of local variable names / values.
         *
         * @param  {string} view
         * @param  {hash} options
         * @settings 'views', 'cache views'
         * @api public
         */

        render: function(view, options) {
          var self = this,
              options = options || {},
              path = set('views') + '/' + view,
              type = path.split('.').slice(-2)[0],
              ext = extname(path),
              layout = options.layout === undefined ? true : options.layout
          self.contentType(ext)
          function render(content) {
            content = engine[type].render(content, options)
            if (layout)
              self.render('layout.' + type + '.' + ext, process.mixin(options, {
                layout: false,
                locals: {
                  body: content
                }
              }))
            else
              self.halt(200, content)
          }
          if (set('cache views') && cache[view])
            render(cache[view])
          else
            posix.cat(path).addCallback(function(content){
              render(cache[view] = content)
            }).addErrback(function(e){
              throw e
            })
        }
      })
    }
  }
})

