
var express = require('express'),
    connect = require('connect');

module.exports = {
    'test inheritance': function(assert){
        var server = express.createServer();
        assert.ok(server instanceof connect.Server, 'Test serverlication inheritance');
    },
    
    'test connect middleware autoloaders': function(assert){
        assert.equal(express.errorHandler, connect.errorHandler);
    },
    
    'test basic server': function(assert){
        var server = express.createServer();

        server.get('/', function(req, res){
            assert.equal('test', server.set('env'), 'env setting was not set properly');
            res.writeHead(200, {});
            res.end('wahoo');
        });

        server.put('/user/:id', function(req, res){
            res.writeHead(200, {});
            res.end('updated user ' + req.params.id)
        });

        assert.response(server,
            { url: '/' },
            { body: 'wahoo' });
        
        assert.response(server,
            { url: '/user/12', method: 'PUT' },
            { body: 'updated user 12' });
    },
    
    'test constructor middleware': function(assert, beforeExit){
        var calls = [];
        function one(req, res, next){
            calls.push('one');
            next();
        }
        function two(req, res, next){
            calls.push('two');
            next();
        }
        var app = express.createServer(one, two);
        app.get('/', function(req, res){
            res.writeHead(200, {});
            res.end('foo bar');
        });
        
        assert.response(app,
            { url: '/' },
            { body: 'foo bar' });
        
        beforeExit(function(){
            assert.eql(['one', 'two'], calls);
        });
    },
    
    'test #error()': function(assert){
        // Passing down middleware stack
        var app = express.createServer();
        
        app.get('/', function(req, res, next){
            next(new Error('broken'));
        });
        
        app.use('/', connect.errorHandler());
        
        assert.response(app,
            { url: '/' },
            { body: 'Internal Server Error' });

        // Custom handler
        var app = express.createServer();
        
        app.error(function(err, req, res){
            res.send('Shit: ' + err.message, 500);
        });

        app.get('/', function(req, res, next){
            next(new Error('broken'));
        });
        
        assert.response(app,
            { url: '/' },
            { body: 'Shit: broken', status: 500 });
        
        // Multiple error()s
        var app = express.createServer();
        
        app.error(function(err, req, res, next){
            if (err.message === 'broken') {
                next(err);
            } else {
                res.send(500);
            }
        });
        
        app.error(function(err, req, res, next){
            res.send(err.message, 500);
        });

        app.get('/', function(req, res, next){
            throw new Error('broken');
        });
        app.get('/foo', function(req, res, next){
            throw new Error('oh noes');
        });
        
        assert.response(app,
            { url: '/' },
            { body: 'broken', status: 500 });
        assert.response(app,
            { url: '/foo' },
            { body: 'Internal Server Error' });
    },
    
    'test next()': function(assert){
        var app = express.createServer();
        
        app.get('/user.:format?', function(req, res, next){
            switch (req.params.format) {
                case 'json':
                    res.writeHead(200, {});
                    res.end('some json');
                    break;
                default:
                    next();
            }
        });
        
        app.get('/user', function(req, res){
            res.writeHead(200, {});
            res.end('no json :)');
        });
        
        assert.response(app,
            { url: '/user.json' },
            { body: 'some json' });
        
        assert.response(app,
            { url: '/user' },
            { body: 'no json :)' });
    },
    
    'test #use()': function(assert){
        var app = express.createServer();

        app.get('/users', function(req, res, next){
            next(new Error('fail!!'));
        });
        app.use('/', connect.errorHandler({ showMessage: true }));
        
        assert.response(app,
            { url: '/users' },
            { body: 'Error: fail!!' });
    },
    
    'test #configure()': function(assert, beforeExit){
        var calls = [];
        process.env.EXPRESS_ENV = 'development';
        var server = express.createServer();
        
        // Config blocks
        var ret = server.configure(function(){
            assert.equal(this, server, 'Test context of configure() is the server');
            calls.push('any');
        }).configure('development', function(){
            calls.push('dev');
        }).configure('production', function(){
            calls.push('production');
        });

        assert.equal(ret, server, 'Test #configure() returns server for chaining');

        assert.response(server,
            { url: '/' },
            { body: 'Cannot GET /' });

        beforeExit(function(){
            assert.eql(['any', 'dev'], calls);
        });
    },
    
    'test #configure() immediate call': function(assert){
        var app = express.createServer();

        app.configure(function(){
            app.use(connect.bodyDecoder());
        });
        
        app.post('/', function(req, res){
            res.send(req.param('name') || 'nope');
        });

        assert.response(app,
            { url: '/', method: 'POST', data: 'name=tj', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }},
            { body: 'tj' });
    },

    'test #configure() precedence': function(assert){
        var app = express.createServer();
    
        app.configure(function(){
            app.use(function(req, res, next){
                res.writeHead(200, {});
                res.write('first');
                next();
            });
            app.use(app.router);
            app.use(function(req, res, next){
                res.end('last');
            });
        });
        
        app.get('/', function(req, res, next){
            res.write(' route ');
            next();
        });
    
        assert.response(app,
            { url: '/' },
            { body: 'first route last' });
    },
    
    'test #set()': function(assert){
        var app = express.createServer();
        var ret = app.set('title', 'My App').set('something', 'else');
        assert.equal(app, ret, 'Test #set() returns server for chaining');
        assert.equal('My App', app.set('title'));
        assert.equal('else', app.set('something'));
    },
    
    'test #enable()': function(assert){
        var app = express.createServer();
        var ret = app.enable('some feature');
        assert.equal(app, ret, 'Test #enable() returns server for chaining');
        assert.strictEqual(true, app.set('some feature'));
    },
    
    'test #disable()': function(assert){
        var app = express.createServer();
        var ret = app.disable('some feature');
        assert.equal(app, ret, 'Test #disable() returns server for chaining');
        assert.strictEqual(false, app.set('some feature'));
    },
    
    'test middleware precedence': function(assert){
        var app = express.createServer();
        
        app.use(connect.bodyDecoder());

        assert.equal(2, app.stack.length);
        
        app.post('/', function(req, res){
            res.send(JSON.stringify(req.body || ''));
        });
        app.get('/', function(){
            
        });
        assert.equal(3, app.stack.length);

        assert.response(app,
            { url: '/', method: 'POST', data: 'name=tj', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }},
            { body: '{"name":"tj"}' });
    },
    
    'test mounting': function(assert){
        var called,
            app = express.createServer(),
            blog = express.createServer(),
            map = express.createServer();

        map.set('home', '/map');
        
        map.mounted(function(parent){
            called = true;
            assert.equal(this, map, 'mounted() is not in context of the child app');
            assert.equal(app, parent, 'mounted() was not called with parent app');
        });
        
        app.use('/blog', blog);
        app.use('/contact', map);
        assert.equal('/blog', blog.route);
        assert.equal('/contact', map.route);
        assert.ok(called, 'mounted() hook failed');
        
        app.get('/', function(req, res){
            assert.equal('/', app.set('home'), "home did not default to /");
            assert.equal('/blog', blog.set('home'), "home did not default to Server#route when mounted");
            assert.equal('/contact/map', map.set('home'), 'home did not prepend route on Server#use()');
            res.send('main app');
        });

        blog.get('/', function(req, res){
            res.send('blog index');
        });
        
        blog.get('/post/:id', function(req, res){
            res.send('blog post ' + req.params.id);
        });
        
        assert.response(app,
            { url: '/' },
            { body: 'main app' });
        assert.response(app,
            { url: '/blog' },
            { body: 'blog index' });
        assert.response(app,
            { url: '/blog/post/12' },
            { body: 'blog post 12' });
        assert.response(blog,
            { url: '/' },
            { body: 'blog index' });
    }
};