
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