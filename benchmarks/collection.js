
require.paths.unshift('lib')
require.paths.unshift('benchmarks')
process.mixin(GLOBAL, require('sys'))
process.mixin(GLOBAL, require('benchmark'))
require('express')

print = puts

range = function(a, b) {
  var array = []
  while (a++ < b)
    array.push(a-1)
  return array
}

suite('Collection with array', 100, function(){
  array = range(0, 50000)
  
  benchmark('for', function(){
    for (var i = 0, len = array.length; i < len; ++i) ;
  })
  
  benchmark('for uncached', function(){
    for (var i = 0; i < array.length; ++i) ;
  })
  
  benchmark('forEach', function(){
    array.forEach(function(){})
  })
  
  benchmark('#each', function(){
    $(array).each(function(){})
  })
})