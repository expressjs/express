
require.paths.unshift("./lib")
require('express')
require('express/plugins')

use(Profiler)
use(MethodOverride)
use(ContentLength)

configure(function(){
  set('root', dirname(__filename))
  enable('cache views')
})


get('/user/:id?', function() {
  render('user.haml.html', {
    locals: {
      name: param('id') ? 'User ' + param('id') : 'You' 
    }
  })
})

run()