
require.paths.unshift("./lib")
require('express')

p(__filename)
set('views', 'examples/views')

get('/user/:id?', function() {
  if (param('id'))
    return 'Viewing user ' + param('id')
  return 'Your user account'
})

run()