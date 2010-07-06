
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
        app.get('/', function(req, res){
            res.render('items.jade', { locals: { items: ['one', 'two'] }});
        });
        assert.response(app,
            { url: '/' },
            { body: '<html><body><ul><li>one</li><li>two</li></ul></body></html>' });
    }
};