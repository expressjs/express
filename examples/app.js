
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
  use(MethodOverride)
  use(ContentLength)
  use(CommonLogger)
  set('root', dirname(__filename))
  enable('cache views')
})

var messages = [],
    StaticFile = require('express/static').File
    
get('/', function(){
  this.redirect('/chat')
})

get('/chat', function(){
  this.render('chat.haml.html', {
    locals: {
      messages: messages
    }
  })
})

post('/chat', function(){
  messages.push(escape(this.param('message')))
  this.halt(200)
})

get('/chat/messages', function(){
  var self = this,
      previousLength = messages.length,
      timer = setInterval(function(){
    if (messages.length > previousLength)
      self.contentType('json'),
      previousLength = messages.length,
      self.halt(200, JSON.encode(messages)),
      clearInterval(timer)
  }, 100)
})

get('/public/*', function(file){
  this.sendfile(dirname(__filename) + '/public/' + file)
})

get('/error', function(){
  throw new Error('oh noes!')
})

run()