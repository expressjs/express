
/**
 * Module dependencies.
 */

var express = require('express');

module.exports = {
    'test #render()': function(assert){
        var app = express.createServer();
        app.set('views', __dirname + '/fixtures');
        app.get('/', function(req, res){
            res.render('index.jade', { layout: false });
        });
        assert.response(app,
            { url: '/' },
            { body: '<p>Welcome</p>' });
    }
};