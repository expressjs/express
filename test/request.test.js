
/**
 * Module dependencies.
 */

var express = require('express');

module.exports = {
    '#isXMLHttpRequest': function(assert){
        var app = express.createServer();
        
        app.get('/isxhr', function(req, res, params){
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
    }
};