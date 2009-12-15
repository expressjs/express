
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
  use(CommonLogger)
  use(MethodOverride)
  use(ContentLength)
  set('root', dirname(__filename))
  enable('helpful 404')
  enable('show exceptions')
  enable('cache views')
})

var messages = []

get('/chat', function(){
  render('chat.haml.html', {
    locals: {
      messages: messages
    }
  })
})

post('/chat', function(){
  messages.push(param('message'))
  halt(200)
})

get('/chat/messages', function(){
  contentType('json')
  return JSON.encode(messages)
})

get('/public/:file', function(file){
  var path = dirname(__filename) + '/public/' + file
  require('path').exists(path, function(exists){
    if (!exists) halt()
    require('posix').cat(path).addCallback(function(content){
      contentType(path)
      halt(200, content)
    })
  })
})

get('/error', function(){
  throw new Error('oh noes!')
})

run()