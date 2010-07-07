
/**
 * Module dependencies.
 */

var express = require('express'),
    connect = require('connect');

module.exports = {
    '#isXMLHttpRequest': function(assert){
        var app = express.createServer();
        
        app.get('/isxhr', function(req, res, params){
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
    
    '#header()': function(assert){
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
    
    '#accepts()': function(assert){
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
            assert.strictEqual(false, req.accepts(' '));
            res.send('ok');
        });
        
        assert.response(app,
            { url: '/all', headers: { Accept: '*/*' }},
            { body: 'ok' });
        assert.response(app,
            { url: '/', headers: { Accept: 'text/html; application/json; text/*' }},
            { body: 'ok' });
    },
    
    '#param()': function(assert){
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
    }
};