
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
  use(Profiler)
  use(MethodOverride)
  use(ContentLength)
  use(Redirect)
  set('root', dirname(__filename))
  enable('cache views')
})

get('/hello', function(){
  contentType('html')
  return '<h1>World<h1>'
})

get('/user/:id?', function(id) {
  render('user.haml.html', {
    locals: {
      name: id ? 'User ' + id : 'You' 
    }
  })
})

run()