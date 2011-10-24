
/**
 * Module dependencies.
 */

var express = require('../')
  , connect = require('connect')
  , assert = require('assert')
  , should = require('should')
  , Route = express.Route;

module.exports = {
  'test route middleware': function(beforeExit){
    var app = express.createServer()
      , calls = 0;

    function allow(role) {
      return function(req, res, next) {
        // this is totally not real, dont use this :)
        // for tests only
        if (req.headers['x-role'] == role) {
          next();
        } else {
          res.send(401);
        }
      }
    }
    
    function restrictAge(age) {
      return function(req, res, next){
        if (req.headers['x-age'] >= age) {
          next();
        } else {
          res.send(403);
        }
      }
    }

    app.param('user', function(req, res, next, user){
      ++calls;
      next();
    });

    app.get('/xxx', allow('member'), restrictAge(18), function(req, res){
      res.send(200);
    });

    app.get('/booze', [allow('member')], restrictAge(18), function(req, res){
      res.send(200);
    });

    app.get('/tobi', [allow('member')], [[restrictAge(18)]], function(req, res){
      res.send(200);
    });
    
    app.get('/user/:user', [allow('member'), [[restrictAge(18)]]], function(req, res){
      res.send(200);
    });

    ['xxx', 'booze', 'tobi', 'user/tj'].forEach(function(thing){
      assert.response(app,
        { url: '/' + thing },
        { body: 'Unauthorized', status: 401 });
      assert.response(app,
        { url: '/' + thing, headers: { 'X-Role': 'member' }},
        { body: 'Forbidden', status: 403 });
      assert.response(app,
        { url: '/' + thing, headers: { 'X-Role': 'member', 'X-Age': 18 }},
        { body: 'OK', status: 200 });
    });

    beforeExit(function(){
      calls.should.equal(3);
    });
  },

  'test app.param() multiple mapping functions': function(){
    var app = express.createServer();

    app.param(function(name, fn){
      if (fn.length < 3) {
        return function(req, res, next, val){
          val = req.params[name] = fn(val);
          if (false === val) {
            next('route');
          } else {
            next();
          }
        };
      }
    });

    app.param(function(name, range){
      if (!~String(range).indexOf('..')) return;
      var parts = range.split('..')
        , from = parseInt(parts.shift())
        , to = parseInt(parts.shift());

      return function(req, res, next, val){
        if (val < from || val > to) return next('route');
        next();
      }
    });

    app.param('user', Number);
    app.param('user', '0..5');

    app.get('/user/:user', function(req, res){
      res.json(req.params.user);
    });

    assert.response(app,
      { url: '/user/3' },
      { body: '3' });

    assert.response(app,
      { url: '/user/6' },
      { status: 404 });
  },

  'test app.param() name passing': function(){
    var app = express.createServer();
    
    app.param(function(name, fn){
      if (fn.length < 3) {
        return function(req, res, next, val){
          val = req.params[name] = fn(val);
          if (false === val) {
            next('route');
          } else {
            next();
          }
        };
      }
    });

    function within(a, b) {
      return function(req, res, next, val, name){
        if (val < a || val > b) {
          return next(new Error(name + ' should be within ' + a + '..' + b));
        }
        next();
      }
    }

    app.param('user', Number);
    app.param('user', within(0, 5));

    app.get('/user/:user', function(req, res){
      res.json(req.params.user);
    });

    app.use(function(err, req, res, next){
      res.json({ error: err.message });
    });

    assert.response(app,
      { url: '/user/0' },
      { body: '0' });

    assert.response(app,
      { url: '/user/6' },
      { body: '{"error":"user should be within 0..5"}' });
  },

  'test app.param() multiple callbacks and array of params': function(){
    var app = express.createServer();
    var users = [{ name: 'tj' }];
    var pets = [['tobi', 'loki', 'jane', 'manny', 'luna']];

    function loadUser(req, res, next, id) {
      req.user = users[id];
      next();
    }

    function loadUserPets(req, res, next, id) {
      req.user.pets = pets[id];
      next();
    }

    app.param(['user_id', 'user'], loadUser, loadUserPets);

    app.get('/user/:user_id', function(req, res){
      res.send(req.user);
    });

    app.get('/account/:user', function(req, res){
      res.send(req.user);
    });

    assert.response(app,
      { url: '/account/0' },
      { body: '{"name":"tj","pets":["tobi","loki","jane","manny","luna"]}' });

    assert.response(app,
      { url: '/user/0' },
      { body: '{"name":"tj","pets":["tobi","loki","jane","manny","luna"]}' });
  },

  'test app.param() multiple callbacks': function(){
    var app = express.createServer();
    var users = [{ name: 'tj' }];
    var pets = [['tobi', 'loki', 'jane', 'manny', 'luna']];

    function loadUser(req, res, next, id) {
      req.user = users[id];
      next();
    }

    function loadUserPets(req, res, next, id) {
      req.user.pets = pets[id];
      next();
    }

    app.param('user_id', loadUser, loadUserPets);

    app.get('/user/:user_id', function(req, res){
      res.send(req.user);
    });

    assert.response(app,
      { url: '/user/0' },
      { body: '{"name":"tj","pets":["tobi","loki","jane","manny","luna"]}' });
  },

  'test app.param() multiple calls with error': function(){
    var app = express.createServer();

    var commits = ['foo', 'bar', 'baz'];

    app.param('commit', function(req, res, next, id){
      req.commit = parseInt(id);
      if (isNaN(req.commit)) return next('route');
      next();
    });

    app.param('commit', function(req, res, next, id){
      req.commit = commits[req.commit];
      next(new Error('failed'));
    });

    app.get('/commit/:commit', function(req, res){
      res.send(req.commit);
    });

    assert.response(app,
      { url: '/commit/0' },
      { status: 500 });
  },

  'test app.param() multiple calls': function(){
    var app = express.createServer();

    var commits = ['foo', 'bar', 'baz'];

    app.param('commit', function(req, res, next, id){
      req.commit = parseInt(id);
      if (isNaN(req.commit)) return next('route');
      next();
    });

    app.param('commit', function(req, res, next, id){
      req.commit = commits[req.commit];
      next();
    });

    app.get('/commit/:commit', function(req, res){
      res.send(req.commit);
    });

    assert.response(app,
      { url: '/commit/0' },
      { body: 'foo' });

    assert.response(app,
      { url: '/commit/0x01' },
      { body: 'bar' });

    assert.response(app,
      { url: '/commit/asdf' },
      { status: 404 });
  },

  'test app.param(fn)': function(){
    var app = express.createServer();
    
    app.param(function(name, fn){
      if (fn instanceof RegExp) {
        return function(req, res, next, val){
          var captures;
          if (captures = fn.exec(String(val))) {
            req.params[name] = captures[1];
            next();
          } else {
            next('route');
          }
        }
      }
    });

    app.param('commit', /^(\d+)$/);

    app.get('/commit/:commit', function(req, res){
      res.send(req.params.commit);
    });

    assert.response(app,
      { url: '/commit/12' },
      { body: '12' });

    assert.response(app,
      { url: '/commit/asdf' },
      { status: 404 });
  },

  'test precedence': function(){
    var app = express.createServer();

    var hits = [];

    app.all('*', function(req, res, next){
      hits.push('all');
      next();
    });

    app.get('/foo', function(req, res, next){
      hits.push('GET /foo');
      next();
    });
    
    app.get('/foo', function(req, res, next){
      hits.push('GET /foo2');
      next();
    });

    app.put('/foo', function(req, res, next){
      hits.push('PUT /foo');
      next();
    });

    assert.response(app,
      { url: '/foo' },
      function(){
        hits.should.eql(['all', 'GET /foo', 'GET /foo2']);
      });
  },

  'test named capture groups': function(){
    var app = express.createServer();

    app.get('/user/:id([0-9]{2,10})', function(req, res){
      res.send('user ' + req.params.id);
    });

    app.post('/pin/save/:lat(\\d+.\\d+)/:long(\\d+.\\d+)', function(req, res){
      res.send(req.params.lat + ' ' + req.params.long);
    });

    app.post('/pin/save2/:lat([0-9]+.[0-9]+)/:long([0-9]+.[0-9]+)', function(req, res){
      res.send(req.params.lat + ' ' + req.params.long);
    });

    assert.response(app,
      { url: '/pin/save/1.2/3.4', method: 'POST' },
      { body: '1.2 3.4' });

    assert.response(app,
      { url: '/pin/save2/1.2/3.4', method: 'POST' },
      { body: '1.2 3.4' });

    assert.response(app,
      { url: '/user/12' },
      { body: 'user 12' });
    
    assert.response(app,
      { url: '/user/ab' },
      { body: 'Cannot GET /user/ab' });
  },
  
  'test named capture group after dot': function(){
    var app = express.createServer();
  
    app.get('/user/:name.:format?', function(req, res){
      res.send(req.params.name + ' - ' + (req.params.format || ''));
    });
    
    assert.response(app,
      { url: '/user/foo' },
      { body: 'foo - ' });
    
    assert.response(app,
      { url: '/user/foo.json' },
      { body: 'foo - json' });
    
    assert.response(app,
      { url: '/user/foo.bar.json' },
      { body: 'foo.bar - json' });
  },
  
  'test optional * value': function(){
    var app = express.createServer();
  
    app.get('/admin*', function(req, res){
      res.send(req.params[0]);
    });

    app.get('/file/*.*', function(req, res){
      res.send(req.params[0] + ' - ' + req.params[1]);
    });

    assert.response(app,
      { url: '/file/some.foo.bar' },
      { body: 'some.foo - bar' });

    assert.response(app,
      { url: '/admin', },
      { body: '', status: 200 });

    assert.response(app,
      { url: '/adminify', },
      { body: 'ify', status: 200 });
  },
  
  'test app.param()': function(){
    var app = express.createServer();

    var users = [
        { name: 'tj' }
      , { name: 'tobi' }
      , { name: 'loki' }
      , { name: 'jane' }
      , { name: 'bandit' }
    ];

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

    assert.response(app,
      { url: '/user/0' },
      { body: 'user tj' });
    
    assert.response(app,
      { url: '/user/1' },
      { body: 'user tobi' });
  },

  'test app.param() optional execution': function(beforeExit){
    var app = express.createServer()
      , calls = 0;

    var months = ['Jan', 'Feb', 'Mar'];

    app.param('month', function(req, res, next, n){
      req.params.month = months[n];
      ++calls;
      next();
    });

    app.get('/calendar/:month?', function(req, res, next){
      res.send(req.params.month || months[0]);
    });

    assert.response(app,
      { url: '/calendar' },
      { body: 'Jan' });

    assert.response(app,
      { url: '/calendar/1' },
      { body: 'Feb' });

    beforeExit(function(){
      calls.should.equal(1);
    });
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
    route.callbacks.should.be.an.instanceof(Array);
    route.path.should.equal('/user/:id');
    route.regexp.should.be.an.instanceof(RegExp);
    route.method.should.equal('get');
    route.keys.should.eql([{ name: 'id', optional: false }]);

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
    app.lookup('/user/:id').should.have.length(2);
  },

  'test app.remove': function(){
    var app = express.createServer();
    app.get('/user', function(){});
    app.get('/user', function(){});
    app.put('/user', function(){});

    app.get('/user').should.have.length(2);
    var removed = app.remove.get('/user');
    removed.should.have.length(2);

    var removed = app.remove.get('/user');
    removed.should.have.length(0);
    app.get('/user').should.have.length(0);

    app.get('/user/:id', function(){});
    app.put('/user/:id', function(){});
    app.del('/user/:id', function(){});

    app.remove.all('/user/:id').should.have.length(3);
    app.remove.all('/user/:id').should.have.length(0);
    
    app.get('/user/:id', function(){});
    app.put('/user/:id', function(){});
    app.del('/user/:id', function(){});

    app.remove('/user/:id').should.have.length(3);
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
    route.path.should.equal('/user/:id');
    route.regexp.should.be.an.instanceof(RegExp);
    route.method.should.equal('get');
    route.keys.should.eql([{ name: 'id', optional: false }]);
    //route.params.id.should.equal('12');

    app.match.get('/user').should.have.length(1);
    app.match.get('/user/12').should.have.length(2);
    app.match.get('/user/12/:op?').should.have.length(1);
    app.match.put('/user/100').should.have.length(1);
    app.match.get('/user/5/edit').should.have.length(2);
    app.match.get('/').should.have.be.empty;
    app.match.all('/user/123').should.have.length(3);
    app.match('/user/123').should.have.length(3);
  },

  'test app.routes.all()': function(){
    var app = express.createServer();
    app.get('/user', function(){});
    app.get('/user/:id', function(){});
    app.get('/user/:id/:op?', function(){});
    app.put('/user/:id', function(){});
    app.get('/user/:id/edit', function(){});
    app.routes.all()[0].should.be.an.instanceof(Route);
    app.routes.all().length.should.equal(5);
  },

  'test Collection': function(){
    var app = express.createServer();
    app.get('/user', function(){});
    app.get('/user/:id', function(){});
    app.get('/user/:id/:op?', function(){});
    app.put('/user/:id', function(){});
    app.get('/user/:id/edit', function(){});

    var ret = app.match.all('/user/12').remove();
    ret.should.have.length(3);
    app.match.all('/user/12').should.have.length(0);
    app.get('/user/:id').should.have.length(0);
  },

  'test "strict routing" setting': function(){
    var app = express.createServer();

    app.enable('strict routing');

    app.get('/:path', function(req, res, next){
      res.send({ type: 'directory' });
    });

    app.get('/:path/', function(req, res, next){
      res.send(['.', '..', 'foo.js', 'bar.js']);
    });

    assert.response(app,
      { url: '/lib' },
      { body: '{"type":"directory"}' });

    assert.response(app,
      { url: '/lib/' },
      { body: '[".","..","foo.js","bar.js"]' });
  },

  'test "case sensitive routes" setting': function(){
    var app = express.createServer();

    app.enable('case sensitive routes');

    app.get('/account', function(req, res){
      res.send('account');
    });
    
    app.get('/Account', function(req, res){
      res.send('Account');
    });

    assert.response(app,
      { url: '/account' },
      { body: 'account' });

    assert.response(app,
      { url: '/Account' },
      { body: 'Account' });
  },
  
  'override OPTIONS default': function(){
    var app = express.createServer();

    app.get('/', function(req, res, next){
      
    });

    app.options('/foo', function(req, res, next){
      res.header('Allow', 'GET')
      res.send('whatever');
    });

    assert.response(app,
      { url: '/', method: 'OPTIONS' },
      { body: 'GET', headers: { Allow: 'GET' }});

    assert.response(app,
      { url: '/foo', method: 'OPTIONS' },
      { body: 'whatever', headers: { Allow: 'GET' }});
  },
  
  'test req.route': function(){
    var app = express.createServer();

    var routes = [];

    app.get('/:foo?', function(req, res, next){
      routes.push(req.route.path);
      next();
    });

    app.get('/foo', function(req, res, next){
      routes.push(req.route.path);
      next();
    });

    assert.response(app,
      { url: '/foo' },
      function(){
        routes.should.eql(['/:foo?', '/foo']);
      });
  },
  
  'test route callback error handling': function(){
    var app = express.createServer()
      , calls = [];

    app.get('/user/:id', function(req, res, next){
      calls.push('one');
      next();
    });

    app.get('/user/:id', function(req, res, next){
      calls.push('two');
      next(new Error('fail'));
    });

    app.get('/user/:id', function(req, res, next){
      calls.push('three');
      next();
    });
    
    app.get('/user/*', function(err, req, res, next){
      res.statusCode = 500;
      res.send('error: ' + err.message);
    });

    app.get('/user/*', function(req, res, next){
      calls.push('four');
      next();
    });

    assert.response(app,
      { url: '/user/12' },
      { body: 'error: fail' }, function(){
        calls.should.eql(['one', 'two']);
      });
  },
  
  'test route callback thrown error handling': function(){
    var app = express.createServer()
      , calls = [];

    app.get('/user/:id', function(req, res, next){
      calls.push('one');
      next();
    });

    app.get('/user/:id', function(req, res, next){
      calls.push('two');
      throw new Error('fail');
    });

    app.get('/user/:id', function(req, res, next){
      calls.push('three');
      next();
    });
    
    app.get('/user/*', function(err, req, res, next){
      res.statusCode = 500;
      res.send('error: ' + err.message);
    });

    app.get('/user/*', function(req, res, next){
      calls.push('four');
      next();
    });

    assert.response(app,
      { url: '/user/12' },
      { body: 'error: fail' }, function(){
        calls.should.eql(['one', 'two']);
      });
  },
  
  'test route callback error recovery': function(){
    var app = express.createServer();

    app.get('/user/:id', function(req, res, next){
      next(new Error('fail'));
    });

    app.get('/user/*', function(err, req, res, next){
      req.error = err;
      next();
    });

    app.get('/user/*', function(req, res, next){
      res.send('recovered from error: ' + req.error.message);
    });

    assert.response(app,
      { url: '/user/12' },
      { body: 'recovered from error: fail' });
  },
  
  'test multiple param callbacks': function(){
    var app = express.createServer();

    app.param('user', function(req, res, next, id){
      req.user = { id: id };
      next();
    });

    app.param('forum_id', function(req, res, next, id){
      req.forum = { id: id };
      next();
    });

    app.param('thread_id', function(req, res, next, id){
      req.thread = { id: id };
      next();
    });

    function array(req, res, next) {
      req.arr = [req.user.id, req.forum.id, req.thread.id];
      next();
    }

    app.get('/:user/:forum_id/:thread_id', array, function(req, res){
      res.send(req.arr);
    });

    assert.response(app,
      { url: '/1/2/3' },
      { body: '["1","2","3"]' });
  }
};
