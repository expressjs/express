
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
  use(MethodOverride)
  use(ContentLength)
  use(CommonLogger)
  set('root', dirname(__filename))
  enable('helpful 404')
  enable('show exceptions')
  enable('cache views')
})

var messages = [],
    path = require('path'),
    posix = require('posix')

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
  messages.push(this.param('message'))
  this.halt(200)
})

get('/chat/messages', function(){
  this.contentType('json')
  return JSON.encode(messages)
})

get('/public/:file', function(file){
  var self = this
  file = dirname(__filename) + '/public/' + file
  path.exists(file, function(exists){
    if (!exists) self.halt()
    posix.cat(file).addCallback(function(content){
      self.contentType(file)
      self.halt(200, content)
    })
  })
})

get('/error', function(){
  throw new Error('oh noes!')
})

run()