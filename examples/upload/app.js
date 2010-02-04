
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
  use(MethodOverride)
  use(ContentLength)
  use(CommonLogger)
  set('root', __dirname)
})

get('/', function(){
  this.redirect('/upload')
})

get('/upload', function(){
  this.render('upload.haml.html')
})

post('/upload', function(){
  $(this.param('images')).each(function(image){
    puts('uploaded ' + image.filename + ' to ' + image.tempfile)
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