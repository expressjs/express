
require.paths.unshift('lib')
require('express')

get('/', function(){
  return 'Hello World'
})

run()