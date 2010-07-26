
/**
 * Module dependencies.
 */

var express = require('express'),
    connect = require('connect'),
    MemoryStore = require('connect/middleware/session/memory');

// Prevent reap timer
var memoryStore = new MemoryStore({ reapInterval: -1 });

module.exports = {
    'test #isXMLHttpRequest': function(assert){
        var app = express.createServer();
        
        app.get('/isxhr', function(req, res){
            assert.equal(req.xhr, req.isXMLHttpRequest);
            res.send(req.isXMLHttpRequest
                ? 'yeaaa boy'
                : 'nope');
        });
        
        assert.response(app,
            { url: '/isxhr' },
            { body: 'nope' });
        
        assert.response(app,
            { url: '/isxhr', headers: { 'X-Requested-With': 'XMLHttpRequest' } },
            { body: 'yeaaa boy' });
    },
    
    'test #header()': function(assert){
        var app = express.createServer();
        
        app.get('/', function(req, res){
            assert.equal('foo.com', req.header('Host'));
            assert.equal('foo.com', req.header('host'));
            res.send('wahoo');
        });
        
        assert.response(app,
            { url: '/', headers: { Host: 'foo.com' }},
            { body: 'wahoo' });
    },
    
    'test #accepts()': function(assert){
        var app = express.createServer();
        
        app.get('/all', function(req, res){
            assert.strictEqual(true, req.accepts('html'));
            assert.strictEqual(true, req.accepts('json'));
            res.send('ok');
        });
        
        app.get('/', function(req, res){
            assert.strictEqual(true, req.accepts('html'));
            assert.strictEqual(true, req.accepts('text/html'));
            assert.strictEqual(true, req.accepts('text/*'));
            assert.strictEqual(true, req.accepts('json'));
            assert.strictEqual(true, req.accepts('application/json'));
            assert.strictEqual(false, req.accepts('xml'));
            assert.strictEqual(false, req.accepts());
            res.send('ok');
        });
        
        app.get('/type', function(req, res){
            assert.strictEqual(true, req.accepts('html'));
            assert.strictEqual(true, req.accepts('text/html'));
            assert.strictEqual(true, req.accepts('json'));
            assert.strictEqual(true, req.accepts('application/json'));
            assert.strictEqual(false, req.accepts('png'));
            assert.strictEqual(false, req.accepts('image/png'));
            res.send('ok'); 
        });
        
        assert.response(app,
            { url: '/all', headers: { Accept: '*/*' }},
            { body: 'ok' });
        assert.response(app,
            { url: '/type', headers: { Accept: 'text/*; application/*' }},
            { body: 'ok' });
        assert.response(app,
            { url: '/', headers: { Accept: 'text/html; application/json; text/*' }},
            { body: 'ok' });
    },
    
    'test #param()': function(assert){
        var app = express.createServer(
            connect.bodyDecoder()
        );
        
        app.get('/user/:id?', function(req, res){
            res.send('user ' + req.param('id'));
        });
        
        app.post('/user', function(req, res){
            res.send('user ' + req.param('id'));
        });
        
        assert.response(app,
            { url: '/user/12' },
            { body: 'user 12' });
        
        assert.response(app,
            { url: '/user?id=5' },
            { body: 'user 5' });
        
        assert.response(app,
            { url: '/user', method: 'POST', data: 'id=1', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }},
            { body: 'user 1' });
    },
    
    'test #flash()': function(assert){
        var app = express.createServer(
            connect.cookieDecoder(),
            connect.session({ store: memoryStore })
        );

        app.get('/', function(req, res){
            assert.eql([], req.flash('info'));
            assert.eql([], req.flash('error'));
            assert.eql({}, req.flash());
            assert.eql({}, req.session.flash);
            
            assert.equal(1, req.flash('info', 'one'));
            assert.equal(2, req.flash('info', 'two'));
            assert.eql(['one', 'two'], req.flash('info'));
            assert.eql([], req.flash('info'));

            assert.equal(1, req.flash('info', 'one'));
            assert.eql({ info: ['one'] }, req.flash());
            
            req.flash('info', 'Email _sent_.');
            req.flash('info', '<script>');
            assert.eql(['Email <em>sent</em>.', '&lt;script&gt;'], req.flash('info'));
            res.send('ok');
        });
        
        assert.response(app,
            { url: '/' },
            { body: 'ok' });
    }
};