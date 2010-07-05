
var express = require('express'),
    connect = require('connect');

module.exports = {
    'test .version': function(assert){
        assert.ok(/^\d+\.\d+\.\d+$/.test(express.version), 'Test express.version format');
    },
    
    'test basic app': function(){
        var app = express.createApplication();
        var server = connect.createServer(app);
        app.get('/', function(req, res){
            res.writeHead(200, {});
            res.end('wahoo');
        });
        assert.response(server,
            { url: '/' },
            { body: 'wahoo' });
    }
};