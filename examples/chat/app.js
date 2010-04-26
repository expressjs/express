
require.paths.unshift('lib')
require('express')
require('express/plugins')

var messages = [],
    utils = require('express/utils'),
    http = require('express/http')
    
configure(function(){
  use(Logger)
  use(MethodOverride)
  use(ContentLength)
  use(Cookie)
  use(Cache, { lifetime: (5).minutes, reapInterval: (1).minute })
  use(Session, { lifetime: (15).minutes, reapInterval: (1).minute })
  use(Static)
  set('root', __dirname)
})

get('/', function(){ 
  this.pass('/chat')
})

get('/chat', function(){
  var self = this
  Session.store.length(function(err, len){
    self.render('chat.html.haml', {
      locals: {
        title: 'Chat',
        messages: messages,
        name: self.session.name,
        usersOnline: len
      }
    })
  })
})

post('/chat', function(){
  this.session.name = this.param('name')
  messages
    .push(utils.escape(this.param('name')) + ': ' + utils.escape(this.param('message'))
    .replace(/(http:\/\/[^\s]+)/g, '<a href="$1" target="express-chat">$1</a>')
    .replace(/:\)/g, '<img src="http://icons3.iconfinder.netdna-cdn.com/data/icons/ledicons/emoticon_smile.png">'))
  this.respond(200)
})

get('/chat/messages', function(){
  var self = this,
      previousLength = messages.length,
      timer = setInterval(function(){
    if (messages.length > previousLength)
      self.contentType('json'),
      previousLength = messages.length,
      self.respond(200, JSON.encode(messages)),
      clearInterval(timer)
  }, 100)
})

get('/*.css', function(file){
  this.render(file + '.css.sass', { layout: false })
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

get('/favicon.ico', function(){
  this.notFound()
})

run()