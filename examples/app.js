
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
  use(Profiler)
  use(MethodOverride)
  use(ContentLength)
  set('root', dirname(__filename))
  enable('cache views')
})

get('/hello', function(){
  contentType('html')
  return '<h1>World<h1>'
})

get('/user/:id?', function() {
  render('user.haml.html', {
    locals: {
      name: param('id') ? 'User ' + param('id') : 'You' 
    }
  })
})

run()