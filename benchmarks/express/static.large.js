
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
  use(Static)
  set('root', __dirname)
})

get('/', function(){
  this.sendfile('benchmarks/shared/huge.js', { bufferSize: 8 * 1024 })
})

run()