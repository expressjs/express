
require.paths.unshift('lib')
require('express')
require('express/plugins')

var sys = require('sys')

configure(function(){
  use(MethodOverride)
  use(ContentLength)
  use(Cookie)
  use(Session)
  use(Flash)
  use(Logger)
  use(Static)
  set('root', __dirname)
  set('max upload size', (5).megabytes)
})

get('/', function(){
  this.redirect('/upload')
})

get('/upload', function(){
  this.render('upload.html.haml', {
    locals: {
      flashes: this.flash('info')
    }  
  })
})

post('/upload', function(){  
  this.param('images').each(function(image){
    sys.puts(image.filename + ' -> ' + image.tempfile)
    this.flash('info', 'Uploaded ' + image.filename)
  }, this)
  this.redirect('/upload')
})

get('/*.css', function(file){
  this.render(file + '.css.sass', { layout: false })
})

run()