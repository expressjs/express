
require.paths.unshift("./lib")
require('express')
require('express/plugins')

use(MethodOverride)
use(ContentLength)
use(CommonLogger)
set('views', dirname(__filename) + '/views')

get('/user/:id?', function() {
  if (param('id'))
    return 'Viewing user ' + param('id')
  return 'Your user account'
})

run()