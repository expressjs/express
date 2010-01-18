
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
  use(MethodOverride)
  use(ContentLength)
  use(CommonLogger)
  set('root', dirname(__filename))
  enable('cache view contents')
})

get('/', function(){
  this.redirect('/upload')
})

get('/upload', function(){
  this.render('upload.haml.html')
})

post('/upload', function(){
  this.redirect('/upload')
})

get('/public/*', function(file){
  this.sendfile(dirname(__filename) + '/public/' + file)
})

get('/*.css', function(file){
  this.render(file + '.sass.css', { layout: false })
})

run()