
/**
 * Module dependencies.
 */

var express = require('express'),
    connect = require('connect');

module.exports = {
    'test #render()': function(assert){
        var app = express.createServer();
        app.set('views', __dirname + '/fixtures');

        app.get('/', function(req, res){
            res.render('index.jade', { layout: false });
        });
        app.get('/haml', function(req, res){
            res.render('hello.haml', { layout: false });
        });

        assert.response(app,
            { url: '/' },
            { body: '<p>Welcome</p>' });
        assert.response(app,
            { url: '/haml' },
            { body: '\n<p>Hello World</p>' });
    },
    
    'test #render() layout': function(assert){
        var app = express.createServer();
        app.set('views', __dirname + '/fixtures');

        app.get('/', function(req, res){
            res.render('index.jade');
        });

        assert.response(app,
            { url: '/' },
            { body: '<html><body><p>Welcome</p></body></html>' });
    },
    
    'test #render() specific layout': function(assert){
        var app = express.createServer();
        app.set('views', __dirname + '/fixtures');

        app.get('/', function(req, res){
            res.render('index.jade', { layout: 'cool.layout.jade' });
        });

        assert.response(app,
            { url: '/' },
            { body: '<cool><p>Welcome</p></cool>' });
    },
    
    'test #partial()': function(assert){
        var app = express.createServer();
        app.set('views', __dirname + '/fixtures');

        // Auto-assigned local w/ collection option
        app.get('/', function(req, res){
            res.render('items.jade', { locals: { items: ['one', 'two'] }});
        });
        
       assert.response(app,
            { url: '/' },
            { body: '<html><body><ul><li>one</li><li>two</li></ul></body></html>' });

        // Auto-assigned local w/ collection array    
        var movies = [
            { title: 'Nightmare Before Christmas', director: 'Tim Burton' },
            { title: 'Avatar', director: 'James Cameron' }
        ];
        app.get('/movies', function(req, res){
            res.render('movies.jade', { locals: { movies: movies }});
        });
            
        var html = [
            '<html>',
            '<body>',
            '<ul>',
            '<li>',
            '<div class="title">Nightmare Before Christmas</div>',
            '<div class="director">Tim Burton</div>',
            '</li>',
            '<li>',
            '<div class="title">Avatar</div>',
            '<div class="director">James Cameron</div>',
            '</li>',
            '</ul>',
            '</body>',
            '</html>'
        ].join('');

        assert.response(app,
            { url: '/movies' },
            { body: html });
    
        // as: str collection option
        app.get('/user', function(req, res){
            res.send(res.partial('user.jade', {
                as: 'person',
                collection: [{ name: 'tj' }]
            }));
        });
        
        assert.response(app,
            { url: '/user' },
            { body: '<p>tj</p>' });
        
        // as: this collection option
        app.get('/person', function(req, res){
            res.send(res.partial('person.jade', {
                as: this,
                collection: [{ name: 'tj' }]
            }));
        });
        
        assert.response(app,
            { url: '/person' },
            { body: '<p>tj</p>' });

        // as: global collection option
        app.get('/videos', function(req, res){
            res.send(res.partial('video.jade', {
                as: global,
                collection: movies
            }));
        });

        assert.response(app,
            { url: '/videos' },
            { body: '<p>Tim Burton</p><p>James Cameron</p>' });
        
        // Magic variables
        app.get('/magic', function(req, res){
            res.send(res.partial('magic.jade', {
                as: 'word',
                collection: ['one', 'two', 'three']
            }));
        });
        
        assert.response(app,
            { url: '/magic' },
            { body: '<li class="first">one</li><li class="word-1">two</li><li class="last">three</li>' });
    }
};