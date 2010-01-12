
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
  use(MethodOverride)
  use(ContentLength)
  use(CommonLogger)
  set('root', dirname(__filename))
  enable('cache static files')
  enable('cache view contents')
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
  messages
    .push(escape(this.param('message'))
    .replace(/(http:\/\/[^\s]+)/g, '<a href="$1" target="express-chat">$1</a>')
    .replace(/:\)/g, '<img src="http://icons3.iconfinder.netdna-cdn.com/data/icons/ledicons/emoticon_smile.png">'))
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

get('/error/view', function(){
  this.render('does.not.exist')
})

get('/error', function(){
  throw new Error('oh noes!')
})

get('/simple', function(){
  return 'Hello :)'
})

run()