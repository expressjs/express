
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

var messages = [],
    path = require('path'),
    posix = require('posix')

get('/', function(){
  redirect('/chat')
})

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

StaticFile = Class({
  init: function(path) {
    this.path = path
  },
  
  send: function() {
    var self = this
    path.exists(this.path, function(exists){
      if (!exists) halt()
      posix.cat(self.path).addCallback(function(content){
        contentType(self.path)
        halt(200, content)
      })
    })
  }
})

get('/public/:file', function(file){
  (new StaticFile(dirname(__filename) + '/public/' + file)).send()
})

get('/error', function(){
  throw new Error('oh noes!')
})

run()