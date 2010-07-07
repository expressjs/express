
/**
 * Module dependencies.
 */

var express = require('express');

module.exports = {
    '#send()': function(assert){
        var app = express.createServer();

        app.get('/html', function(req, res){
            res.send('<p>test</p>', { 'Content-Language': 'en' });
        });
        
        app.get('/json', function(req, res){
            res.header('X-Foo', 'bar');
            res.send({ foo: 'bar' }, { 'X-Foo': 'baz' }, 201);
        });
        
        app.get('/text', function(req, res){
            res.header('X-Foo', 'bar');
            res.contentType('.txt');
            res.send('wahoo');
        });
        
        app.get('/status', function(req, res){
            res.send(404);
        });
        
        app.get('/error', function(req, res){
            res.send('Oh shit!', { 'Content-Type': 'text/plain' }, 500);
        });

        assert.response(app,
            { url: '/html' },
            { body: '<p>test</p>', headers: { 'Content-Language': 'en', 'Content-Type': 'text/html; charset=utf-8' }});
        assert.response(app,
            { url: '/json' },
            { body: '{"foo":"bar"}', status: 201, headers: { 'Content-Type': 'application/json', 'X-Foo': 'baz' }});
        assert.response(app,
            { url: '/text' },
            { body: 'wahoo', headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Foo': 'bar' }});
        assert.response(app,
            { url: '/status' },
            { body: 'Not Found', status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' }});
        assert.response(app,
            { url: '/error' },
            { body: 'Oh shit!', status: 500, headers: { 'Content-Type': 'text/plain' }});
    },
    
    '#contentType': function(assert){
        var app = express.createServer();
        
        app.get('/html', function(req, res){
            res.contentType('index.html');
            res.writeHead(200, res.headers);
            res.end('<p>yay</p>');
        });
        
        assert.response(app,
            { url: '/html' },
            { body: '<p>yay</p>', headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    },
    
    '#attachment': function(assert){
        var app = express.createServer();
        
        app.get('/style.css', function(req, res){
            res.attachment();
            res.send('some stylezzz');
        });

        app.get('/*', function(req, res, params){
            res.attachment(params.splat[0]);
            res.send('whatever');
        });
        
        assert.response(app,
            { url: '/javascripts/jquery.js' },
            { body: 'whatever', headers: { 'Content-Disposition': 'attachment; filename="jquery.js"' }});
        assert.response(app,
            { url: '/style.css' },
            { body: 'some stylezzz', headers: { 'Content-Disposition': 'attachment' }});
    }
};