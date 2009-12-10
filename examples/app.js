
require.paths.unshift("./lib")
require('express')
require('express/plugins')

use(Profiler)
use(MethodOverride)
use(ContentLength)
set('views', dirname(__filename) + '/views')

get('/user/:id?', function() {
  if (param('id'))
    return 'Viewing user ' + param('id')
  return 'Your user account'
})

run()