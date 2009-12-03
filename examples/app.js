
require.paths.unshift("./lib")
require('express')

set('views', dirname(__filename) + '/views')

get('/user/:id?', function() {
  if (param('id'))
    return 'Viewing user ' + param('id')
  return 'Your user account'
})

run()