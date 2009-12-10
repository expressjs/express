
// Express - View - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var posix = require('posix')

/**
 * Render _view_ with _options_.
 *
 * Views are looked up relative to the 
 * 'views' path setting.
 *
 * Options:
 *
 *  - layout:   Whether or not to use a layout. Defaults to true
 *  - context:  Most engines support an evaluation context (the 'this' keyword)
 *  - locals:   Most engines support a hash of local variable names / values.
 *
 * @param  {string} view
 * @param  {hash} options
 * @api public
 */

var render = exports.render = function(view, options) {
  var path = set('views') + '/' + view,
      ext = extname(path),
      engine = require('support/' + ext),
      layout = options.layout === undefined ? true : options.layout
  posix
    .cat(path)
    .addCallback(function(content){
      content = engine.parse(content, options)
      if (layout)
        render('layout.html.' + ext, process.mixin(options, {
          layout: false,
          locals: {
            body: content
          }
        }))
      else
        halt(200, content)
    })
}