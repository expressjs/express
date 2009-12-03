
require.paths.unshift("./lib")
require('express')

get('/hello', function() {
  return 'Whats up!'
})

Express.server.run()
