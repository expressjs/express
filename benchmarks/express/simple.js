
require.paths.unshift('lib')
require('express')

get('/simple', function(){
  return 'Hello :)'
})

run()