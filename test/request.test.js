
/**
 * Module dependencies.
 */

var express = require('../')
  , connect = require('connect')
  , assert = require('assert')
  , should = require('should');

module.exports = {
  'test #path': function(){
    var app = express.createServer();

    app.get('/search', function(req, res){
      res.send(req.path);
    });

    assert.response(app,
      { url: '/search?q=tobi' },
      { body: '/search' });
  },

  'test #isXMLHttpRequest': function(){
    var app = express.createServer();

    app.get('/isxhr', function(req, res){
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
  
  'test #header()': function(){
    var app = express.createServer();
    
    app.get('/', function(req, res){
      req.header('Host').should.equal('foo.com');
      req.header('host').should.equal('foo.com');
      res.send('wahoo');
    });
    
    assert.response(app,
      { url: '/', headers: { Host: 'foo.com' }},
      { body: 'wahoo' });
  },
  
  'test #accepts()': function(){
    var app = express.createServer();
    
    app.get('/all', function(req, res){
      req.accepts('html').should.be.true;
      req.accepts('.html').should.be.true;
      req.accepts('json').should.be.true;
      req.accepts('.json').should.be.true;
      res.send('ok');
    });
    
    app.get('/', function(req, res){
      req.accepts('html').should.be.true;
      req.accepts('.html').should.be.true;
      req.accepts('text/html').should.be.true;
      req.accepts('text/*').should.be.true;
      req.accepts('json').should.be.true;
      req.accepts('application/json').should.be.true;
      
      req.accepts('xml').should.be.false;
      req.accepts('image/*').should.be.false;
      req.accepts('png').should.be.false;
      req.accepts().should.be.false;
      res.send('ok');
    });
    
    app.get('/type', function(req, res){
      req.accepts('html').should.be.true;
      req.accepts('text/html').should.be.true;
      req.accepts('json').should.be.true;
      req.accepts('application/json').should.be.true;
      
      req.accepts('png').should.be.false;
      req.accepts('image/png').should.be.false;
      res.send('ok'); 
    });
    
    assert.response(app,
      { url: '/all', headers: { Accept: '*/*' }},
      { body: 'ok' });
    assert.response(app,
      { url: '/type', headers: { Accept: 'text/*; application/*' }},
      { body: 'ok' });
    assert.response(app,
      { url: '/', headers: { Accept: 'text/html; application/json; text/*' }},
      { body: 'ok' });
  },
  
  'test #param()': function(){
    var app = express.createServer(
      connect.bodyParser()
    );
    
    app.get('/user/:id?', function(req, res){
      res.send('user ' + req.param('id', 'unknown'));
    });
    
    app.post('/user', function(req, res){
      res.send('user ' + req.param('id'));
    });

    app.get('/:sort', function(req, res){
      res.send('sort ' + req.param('sort'));
    });

    assert.response(app,
      { url: '/asc' },
      { body: 'sort asc' });

    assert.response(app,
      { url: '/user/12' },
      { body: 'user 12' });
    
    assert.response(app,
      { url: '/user?id=5' },
      { body: 'user 5' });
    
    assert.response(app,
      { url: '/user' },
      { body: 'user unknown' });
    
    assert.response(app,
      { url: '/user', method: 'POST', data: 'id=1', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }},
      { body: 'user 1' });
  },
  
  'test #flash()': function(){
    var app = express.createServer(
        connect.cookieParser()
      , connect.session({ secret: 'something' })
    );

    app.flashFormatters = {
      u: function(val){
        return String(val).toUpperCase();
      }
    };

    app.get('/', function(req, res){
      req.flash('info').should.be.empty;
      req.flash('error').should.be.empty;
      req.flash().should.eql({});
      req.session.flash.should.eql({});

      req.flash('info', 'one').should.equal(1);
      req.flash('info', 'two').should.equal(2);
      req.flash('info').should.eql(['one', 'two']);
      req.flash('info').should.eql([]);

      req.flash('info', 'one').should.equal(1);
      req.flash('info').should.eql(['one']);

      req.flash('info', 'Email _sent_.');
      req.flash('info', '<em>%s</em>', 'html');
      req.flash('info').should.eql(['Email <em>sent</em>.', '<em>html</em>']);
      
      req.flash('info', 'Welcome _%s_ to %s', 'TJ', 'something');
      req.flash('info').should.eql(['Welcome <em>TJ</em> to something']);

      req.flash('info', 'Welcome %s', '<script>');
      req.flash('info').should.eql(['Welcome &lt;script&gt;']);

      req.flash('error', 'Foo %u', 'bar');
      req.flash('error').should.eql(['Foo BAR']);

      res.send('ok');
    });
    
    assert.response(app,
      { url: '/' },
      { body: 'ok' });
  },
  
  'test #is()': function(){
    var app = express.createServer();

    app.is('an image', function(req){
      return 0 == req.headers['content-type'].indexOf('image');
    });
    
    app.is('text', function(req){
      return 0 == req.headers['content-type'].indexOf('text');
    });

    app.get('/', function(req, res, next){
      if (req.is('html')) return res.send('html');
      res.send('not sure');
    });
    
    app.post('/', function(req, res, next){
      if (req.is('html')) return res.send('/ html');
      if (req.is('json')) return res.send('/ json');
      if (req.is('png')) return res.send('/ png');
      res.send('/ not sure');
    });
    
    app.post('/long', function(req, res, next){
      if (req.is('text/html')) return res.send('/long html');
      if (req.is('application/json')) return res.send('/long json');
      if (req.is('image/png')) return res.send('/long png');
      res.send('/long not sure');
    });
    
    app.put('/custom', function(req, res, next){
      if (req.is('an image')) return res.send('/custom an image');
      if (req.is('text')) return res.send('/custom text');
    });

    assert.response(app,
      { url: '/' },
      { body: 'not sure' });

    assert.response(app,
      { url: '/', method: 'POST', headers: { 'Content-Type': 'text/html' }},
      { body: '/ html' });
    assert.response(app,
      { url: '/', method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }},
      { body: '/ json' });
    assert.response(app,
      { url: '/', method: 'POST', headers: { 'Content-Type': 'image/png' }},
      { body: '/ png' });
    assert.response(app,
      { url: '/', method: 'POST' },
      { body: '/ not sure' });

    assert.response(app,
      { url: '/long', method: 'POST', headers: { 'Content-Type': 'text/html' }},
      { body: '/long html' });
    assert.response(app,
      { url: '/long', method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }},
      { body: '/long json' });
    assert.response(app,
      { url: '/long', method: 'POST', headers: { 'Content-Type': 'image/png' }},
      { body: '/long png' });
    assert.response(app,
      { url: '/long', method: 'POST' },
      { body: '/long not sure' });
    
    assert.response(app,
      { url: '/custom', method: 'PUT', headers: { 'Content-Type': 'text/plain' }},
      { body: '/custom text' });
    assert.response(app,
      { url: '/custom', method: 'PUT', headers: { 'Content-Type': 'text/html' }},
      { body: '/custom text' });
    assert.response(app,
      { url: '/custom', method: 'PUT', headers: { 'Content-Type': 'image/jpeg' }},
      { body: '/custom an image' });
    assert.response(app,
      { url: '/custom', method: 'PUT', headers: { 'Content-Type': 'image/png' }},
      { body: '/custom an image' });
  },
  
  'test #is() wildcard': function(){
    var app = express.createServer();

    app.post('/', function(req, res, next){
      if (req.is('image/*')) return res.send('image');
      if (req.is('*/json')) return res.send('json');
      res.send('not sure');
    });

    assert.response(app,
      { url: '/', method: 'POST', headers: { 'Content-Type': 'image/png' }},
      { body: 'image' });
    assert.response(app,
      { url: '/', method: 'POST', headers: { 'Content-Type': 'image/jpeg' }},
      { body: 'image' });
    assert.response(app,
      { url: '/', method: 'POST', headers: { 'Content-Type': 'text/plain' }},
      { body: 'not sure' });
    assert.response(app,
      { url: '/', method: 'POST', headers: { 'Content-Type': 'text/json' }},
      { body: 'json' });
    assert.response(app,
      { url: '/', method: 'POST', headers: { 'Content-Type': 'application/json' }},
      { body: 'json' });
  },
  
  'test #header() referrer': function(){
    var app = express.createServer();

    app.get('/correct', function(req, res){
      res.send(req.header('Referrer'));
    });
    
    app.get('/incorrect', function(req, res){
      res.send(req.header('Referer'));
    });

    assert.response(app,
      { url: '/correct', headers: { Referer: 'expressjs.com' }},
      { body: 'expressjs.com' });

    assert.response(app,
      { url: '/correct', headers: { Referrer: 'expressjs.com' }},
      { body: 'expressjs.com' });

    assert.response(app,
      { url: '/incorrect', headers: { Referrer: 'expressjs.com' }},
      { body: 'expressjs.com' });

    assert.response(app,
      { url: '/incorrect', headers: { Referer: 'expressjs.com' }},
      { body: 'expressjs.com' });
  },
  
  'test #get(field, param)': function(){
    var app = express.createServer();

    app.get('/', function(req, res, next){
      req.get('content-disposition', 'filename')
        .should.equal('foo bar.jpg');

      req.get('Content-Disposition', 'filename')
        .should.equal('foo bar.jpg');

      req.get('x-content-foo', 'foo').should.equal('bar');
      req.get('x-content-foo', 'bar').should.equal('foo bar baz');
      req.get('x-content-foo', 'woot').should.equal('tobi loki jane');
      req.get('cache-control', 'max-age').should.equal('500');

      req.get('foo').should.equal('');
      req.get('foo', 'bar').should.equal('');
      res.end();
    });

    var fields = {
        'Content-Disposition': 'attachment; filename="foo bar.jpg"'
      , 'X-Content-Foo': 'foo=bar; bar=foo bar baz; woot=tobi loki jane;'
      , 'Cache-Control': 'max-age =   500'
    };

    assert.response(app,
      { url: '/', headers: fields },
      { body: '' });
  }
};