
/**
 * Module dependencies.
 */

var express = require('express');

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
    }
};