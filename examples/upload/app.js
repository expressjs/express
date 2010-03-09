
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
  use(MethodOverride)
  use(ContentLength)
  use(CommonLogger)
  use(Cookie)
  use(Session)
  use(Flash)
  set('root', __dirname)
})

get('/', function(){
  this.redirect('/upload')
})

get('/upload', function(){
  this.render('upload.haml.html', {
    locals: {
      flashes: this.flash('info')
    }  
  })
})

post('/upload', function(){  
  var self = this;
  $(this.param('images')).each(function(image){
    puts(image.filename + ' -> ' + image.tempfile)
    self.flash('info', 'Uploaded ' + image.filename)
  })  
  this.redirect('/upload')
})

get('/public/*', function(file){
  this.sendfile(__dirname + '/public/' + file)
})

get('/*.css', function(file){
  this.render(file + '.sass.css', { layout: false })
})

run()