
/**
 * Module dependencies.
 */

var express = require('express'),
    connect = require('connect'),
    view = require('express/view');

var create = function(){
    var app = express.createServer.apply(express, arguments);
    app.set('views', __dirname + '/fixtures');
    return app;
};

module.exports = {
    'test #render()': function(assert){
        var app = create(connect.errorHandler({ showMessage: true }));
        app.set('view engine', 'jade');

        app.get('/', function(req, res){
            res.render('index.jade', { layout: false });
        });
        app.get('/jade', function(req, res){
            res.render('index', { layout: false });
        });
        app.get('/haml', function(req, res){
            res.render('hello.haml', { layout: false });
        });
        app.get('/callback', function(req, res){
            res.render('hello.haml', { layout: false }, function(err, str){
                assert.ok(!err);
                res.send(str.replace('Hello World', ':)'));
            });
        });
        app.get('/invalid', function(req, res){
            res.render('invalid.jade', { layout: false });
        });
        app.get('/invalid-async', function(req, res){
            process.nextTick(function(){
                res.render('invalid.jade', { layout: false });
            });
        });
        app.get('/error', function(req, res){
            res.render('invalid.jade', { layout: false }, function(err){
                res.send(err.arguments[0]);
            });
        });
        app.get('/absolute', function(req, res){
            res.render(__dirname + '/fixtures/index.jade', { layout: false });
        });

        assert.response(app,
            { url: '/' },
            { body: '<p>Welcome</p>', headers: { 'Content-Type': 'text/html; charset=utf-8' }});
        assert.response(app,
            { url: '/jade' },
            { body: '<p>Welcome</p>' });
        assert.response(app,
            { url: '/absolute' },
            { body: '<p>Welcome</p>' });
        assert.response(app,
            { url: '/haml' },
            { body: '\n<p>Hello World</p>' });
        assert.response(app,
            { url: '/callback' },
            { body: '\n<p>:)</p>' });
        assert.response(app,
            { url: '/error' },
            { body: 'doesNotExist' });
        assert.response(app,
            { url: '/invalid' },
            function(res){
                assert.ok(res.body.indexOf('ReferenceError') >= 0);
                assert.ok(res.body.indexOf('doesNotExist') >= 0);
            });
        assert.response(app,
            { url: '/invalid-async' },
            function(res){
                assert.ok(res.body.indexOf('ReferenceError') >= 0);
                assert.ok(res.body.indexOf('doesNotExist') >= 0);
            });

    },
    
    'test #render() layout': function(assert){
        var app = create();
        app.set('view engine', 'jade');

        app.get('/', function(req, res){
            res.render('index.jade');
        });
        app.get('/jade', function(req, res){
            res.render('index');
        });

        assert.response(app,
            { url: '/' },
            { body: '<html><body><p>Welcome</p></body></html>' });
    },
    
    'test #render() specific layout': function(assert){
        var app = create();

        app.get('/', function(req, res){
            res.render('index.jade', { layout: 'cool-layout.jade' });
        });
        app.get('/no-ext', function(req, res){
            res.render('index.jade', { layout: 'cool-layout' });
        });
        app.get('/relative', function(req, res){
            res.render('index.jade', { layout: 'layouts/foo.jade' });
        });
        app.get('/absolute', function(req, res){
            res.render('index.jade', { layout: __dirname + '/fixtures/layouts/foo.jade' });
        });

        assert.response(app,
            { url: '/' },
            { body: '<cool><p>Welcome</p></cool>' });
        assert.response(app,
            { url: '/no-ext' },
            { body: '<cool><p>Welcome</p></cool>' });
        assert.response(app,
            { url: '/relative' },
            { body: '<foo></foo>' });
        assert.response(app,
            { url: '/absolute' },
            { body: '<foo></foo>' });
    },
    
    'test #render() specific layout "view engine"': function(assert){
        var app = create();
        app.set('view engine', 'jade');
        
        app.get('/', function(req, res){
            res.render('index', { layout: 'cool-layout' });
        });
        
        assert.response(app,
            { url: '/' },
            { body: '<cool><p>Welcome</p></cool>' });
    },
    
    'test #render() scope': function(assert){
        var app = create();
        app.set('view engine', 'jade');
        
        app.get('/', function(req, res){
            res.internal = '1';
            res.method = function(){
                return this.internal;
            };
            res.render('scope.jade', { layout: false });
        });
        
        app.get('/custom', function(req, res){
            var scope = {
              internal: '2',
              method: function(){
                  return this.internal;
              }
            };
            res.render('scope.jade', { layout: false, scope: scope });
        });
        
        assert.response(app,
            { url: '/' },
            { body: '<p>1</p>'});

        assert.response(app,
            { url: '/custom' },
            { body: '<p>2</p>'});
    },
    
    'test #render() view helpers': function(assert){
        var app = create();

        app.helpers({ 
            lastName: 'holowaychuk',
            foo: function(){
               return 'bar'; 
            }
        });

        var ret = app.dynamicHelpers({
            session: function(req, res){
                assert.equal('object', typeof req, 'Test dynamic helper req');
                assert.equal('object', typeof res, 'Test dynamic helper res');
                assert.ok(this instanceof express.Server, 'Test dynamic helper app scope');
                return req.session;
            }
        });

        assert.equal(app, ret, 'Server#helpers() is not chainable');
        
        app.get('/', function(req, res){
            req.session = { name: 'tj' };
            res.render('dynamic-helpers.jade', { layout: false });
        });
        
        assert.response(app,
            { url: '/' },
            { body: '<p>tj holowaychuk bar</p>' });
    },
    
    'test #partial()': function(assert){
        var app = create();

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
                collection: [{ name: 'tj' }],
                locals: { label: 'name:' }
            }));
        });
        
        assert.response(app,
            { url: '/person' },
            { body: '<p>name: tj</p>' });

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
        
        // Non-collection support
        app.get('/movie', function(req, res){
            res.send(res.partial('movie.jade', {
                object: movies[0]
            }));
        });
        
        assert.response(app,
            { url: '/movie' },
            { body: '<li><div class="title">Nightmare Before Christmas</div><div class="director">Tim Burton</div></li>' });
            
        app.get('/video-global', function(req, res){
           res.send(res.partial('video.jade', {
               object: movies[0],
               as: global
           })); 
        });
        
        // Non-collection as: global
        assert.response(app,
            { url: '/video-global' },
            { body: '<p>Tim Burton</p>' });

        app.get('/person-this', function(req, res){
           res.send(res.partial('person.jade', {
               object: { name: 'tj' },
               locals: { label: 'User:' },
               as: this
           })); 
        });
        
        // Non-collection as: this
        assert.response(app,
            { url: '/person-this' },
            { body: '<p>User: tj</p>' });
    
        // No options
        app.get('/nothing', function(req, res){
            res.send(res.partial('hello.ejs'));
        });
        
        assert.response(app,
            { url: '/nothing' },
            { body: 'Hello' });
    }
};