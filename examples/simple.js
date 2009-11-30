
require.paths.unshift("./lib")
require('express')

get('/i/like/:object', function() {
  'You like "' + param('object') + '"'
})

Express.start()
