
require.paths.unshift("./lib")
require('express')

use(require('express/plugins/method-override').MethodOverride)
use(require('express/plugins/content-length').ContentLength)
use(require('express/plugins/common-logger').Logger)
set('views', dirname(__filename) + '/views')

get('/user/:id?', function() {
  p(Express.server.request.uri)
  if (param('id'))
    return 'Viewing user ' + param('id')
  return 'Your user account'
})

run()