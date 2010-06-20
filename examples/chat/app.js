
/**
 * Module dependencies.
 */

var app = module.exports = require('express').createApplication([
    { filter: 'log' },
    { filter: 'method-override' },
    { filter: 'cookie' },
    { filter: 'session' },
    { filter: 'body-decoder' },
    { provider: 'sass', root: __dirname + '/public' },
    { provider: 'static', root: __dirname + '/public' },
]);

/**
 * Chat messages.
 */

var messages = [];

// Routes

app.get('/', function(req, res){
    req.sessionStore.length(function(err, len){
        res.render('chat.html.haml', {
            locals: {
                title: 'Chat',
                messages: messages,
                name: self.session.name,
                usersOnline: len
            }
        })
    });
});

app.post('/chat', function(req, res){
    var name = req.session.name = req.body.name;
    messages.push(name + ': ' + req.body.message);
    res.writeHead(204, {});
    res.end();
});

app.get('/chat/messages', function(req, res){
    var previousLength = messages.length;
    var id = setInterval(function(){
        if (messages.length > previousLength) {
            previousLength = messages.length;
            res.writeHead(200, {
               'Content-Type': 'application/json' 
            });
            res.end(JSON.encode(messages));
            clearInterval(id);
        }
    }, 100);
});