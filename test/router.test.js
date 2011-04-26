
/**
 * Module dependencies.
 */

var express = require('express')
  , connect = require('connect')
  , assert = require('assert')
  , should = require('should')
  , Route = express.Route;

module.exports = {
  'test named capture groups': function(){
    var app = express.createServer();

    app.get('/user/:id([0-9]{2,10})', function(req, res){
      res.send('user ' + req.params.id);
    });

    assert.response(app,
      { url: '/user/12' },
      { body: 'user 12' });
    
    assert.response(app,
      { url: '/user/ab' },
      { body: 'Cannot GET /user/ab' });
  },
  
  'test .param()': function(){
    var app = express.createServer();

    var users = [
        { name: 'tj' }
      , { name: 'tobi' }
      , { name: 'loki' }
      , { name: 'jane' }
      , { name: 'bandit' }
    ];

    function integer(n){ return parseInt(n, 10); };
    app.param(['to', 'from'], integer);

    app.param('user', function(req, res, next, id){
      if (req.user = users[id]) {
        next();
      } else {
        next(new Error('failed to find user'));
      }
    });

    app.get('/user/:user', function(req, res, next){
      res.send('user ' + req.user.name);
    });

    app.get('/users/:from-:to', function(req, res, next){
      var names = users.slice(req.params.from, req.params.to).map(function(user){
        return user.name;
      });
      res.send('users ' + names.join(', '));
    });
    
    assert.response(app,
      { url: '/user/0' },
      { body: 'user tj' });
    
    assert.response(app,
      { url: '/user/1' },
      { body: 'user tobi' });
    
    assert.response(app,
      { url: '/users/0-3' },
      { body: 'users tj, tobi, loki' });
  },
  
  'test OPTIONS': function(){
    var app = express.createServer();
    
    app.get('/', function(){});
    app.get('/user/:id', function(){});
    app.put('/user/:id', function(){});
    
    assert.response(app,
      { url: '/', method: 'OPTIONS' },
      { headers: { Allow: 'GET' }});
    
    assert.response(app,
      { url: '/user/12', method: 'OPTIONS' },
      { headers: { Allow: 'GET,PUT' }});
  },
  
  'test app.lookup': function(){
    var app = express.createServer();
    app.get('/user', function(){});
    app.get('/user/:id', function(){});
    app.get('/user/:id/:op?', function(){});
    app.put('/user/:id', function(){});
    app.get('/user/:id/edit', function(){});

    var route = app.get('/user/:id')[0]
    route.should.be.an.instanceof(Route);
    route.callback.should.be.a('function');
    route.path.should.equal('/user/:id');
    route.regexp.should.be.an.instanceof(RegExp);
    route.method.should.equal('GET');
    route.index.should.equal(1);
    route.keys.should.eql(['id']);

    app.get('/user').should.have.length(1);
    app.get('/user/:id').should.have.length(1);
    app.get('/user/:id/:op?').should.have.length(1);
    app.put('/user/:id').should.have.length(1);
    app.get('/user/:id/edit').should.have.length(1);
    app.get('/').should.have.be.empty;
    app.all('/user/:id').should.have.length(2);

    app.lookup.get('/user').should.have.length(1);
    app.lookup.get('/user/:id').should.have.length(1);
    app.lookup.get('/user/:id/:op?').should.have.length(1);
    app.lookup.put('/user/:id').should.have.length(1);
    app.lookup.get('/user/:id/edit').should.have.length(1);
    app.lookup.get('/').should.have.be.empty;
    app.lookup.all('/user/:id').should.have.length(2);
  },
  
  'test app.match': function(){
    var app = express.createServer();
    app.get('/user', function(){});
    app.get('/user/:id', function(){});
    app.get('/user/:id/:op?', function(){});
    app.put('/user/:id', function(){});
    app.get('/user/:id/edit', function(){});

    var route = app.match.get('/user/12')[0];
    route.should.be.an.instanceof(Route);
    route.callback.should.be.a('function');
    route.path.should.equal('/user/:id');
    route.regexp.should.be.an.instanceof(RegExp);
    route.method.should.equal('GET');
    route.index.should.equal(2);
    route.keys.should.eql(['id']);

    app.match.get('/user').should.have.length(1);
    app.match.get('/user/12').should.have.length(2);
    app.match.get('/user/12/:op?').should.have.length(1);
    app.match.put('/user/100').should.have.length(1);
    app.match.get('/user/5/edit').should.have.length(2);
    app.match.get('/').should.have.be.empty;
    app.match.all('/user/123').should.have.length(3);
  }
};
