
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
  //enable('throw exceptions')
  set('root', __dirname)
  set('views', __dirname + '/../shared')
})

get('/', function(){
  this.render('page.html.haml')
})

run()