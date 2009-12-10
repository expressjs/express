
require.paths.unshift("./lib")
require('express')
require('express/plugins')

use(Profiler)
use(MethodOverride)
use(ContentLength)
set('views', dirname(__filename) + '/views')

get('/user/:id?', function() {
  var body = param('id') ? 
    'Viewing user ' + param('id') : 
      'Your user account'
  render('layout.html.ejs', { locals: { title: 'User', body: body }})
})

run()