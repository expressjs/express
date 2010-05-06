
require.paths.unshift('lib')
require('express')
    
configure(function(){
  set('root', __dirname)
})

get('/', function(){
  this.render('front.html.ejs', {
    locals: {
      title: 'Hello World',
      name: 'Joe',
      items: ['one', 'two', 'three']
    }
  })
})

run()