
require.paths.unshift('lib')
require('express')
require('express/plugins')

var messages = [],
    utils = require('express/utils'),
    kiwi = require('kiwi')

configure(function(){
  var fiveMinutes = 300000,
      oneMinute = 60000
  kiwi.seed('haml')
  kiwi.seed('sass')
  use(MethodOverride)
  use(ContentLength)
  use(Cookie)
  use(Cache, { lifetime: fiveMinutes, reapInterval: oneMinute })
  use(Session, { lifetime: fiveMinutes, reapInterval: oneMinute })
  use(Logger)
  set('root', __dirname)
})

get('/', function(){
  this.redirect('/chat')
})

get('/chat', function(){
  this.render('chat.haml.html', {
    locals: {
      title: 'Chat',
      messages: messages,
      name: this.session.name,
      usersOnline: Session.store.length()
    }
  })
})

post('/chat', function(){
  this.session.name = this.param('name')
  messages
    .push(utils.escape(this.param('name')) + ': ' + utils.escape(this.param('message'))
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
  this.sendfile(__dirname + '/public/' + file)
})

get('/*.css', function(file){
  this.render(file + '.sass.css', { layout: false })
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
  this.halt()
})

run()