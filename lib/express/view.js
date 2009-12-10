
// Express - View - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var posix = require('posix')

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