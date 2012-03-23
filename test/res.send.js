
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.send(null)', function(){
    it('should set body to ""', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(null);
      });

      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('');
        done();
      })
    })
  })
  
  describe('.send(undefined)', function(){
    it('should set body to ""', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(undefined);
      });

      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('');
        done();
      })
    })
  })

  describe('.send(code)', function(){
    it('should set .statusCode', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(201).should.equal(res);
      });

      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('Created');
        res.statusCode.should.equal(201);
        done();
      })
    })
  })
  
  describe('.send(code, body)', function(){
    it('should set .statusCode and body', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(201, 'Created :)');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('Created :)');
        res.statusCode.should.equal(201);
        done();
      })
    })
  })
  
  describe('.send(String)', function(){
    it('should send as html', function(done){
      var app = express();

      app.use(function(req, res){
        res.send('<p>hey</p>');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('content-type', 'text/html; charset=utf-8');
        res.body.should.equal('<p>hey</p>');
        res.statusCode.should.equal(200);
        done();
      })
    })
    
    it('should not override Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/plain').send('hey');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('content-type', 'text/plain');
        res.body.should.equal('hey');
        res.statusCode.should.equal(200);
        done();
      })
    })
  })
  
  describe('.send(Buffer)', function(){
    it('should send as octet-stream', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(new Buffer('hello'));
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('content-type', 'application/octet-stream');
        res.body.should.equal('hello');
        res.statusCode.should.equal(200);
        done();
      })
    })
    
    it('should not override Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/plain').send(new Buffer('hey'));
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('content-type', 'text/plain');
        res.body.should.equal('hey');
        res.statusCode.should.equal(200);
        done();
      })
    })
  })
  
  describe('.send(Object)', function(){
    it('should send as application/json', function(done){
      var app = express();

      app.use(function(req, res){
        res.send({ name: 'tobi' });
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
        res.body.should.equal('{"name":"tobi"}');
        done();
      })
    })
  })

  describe('when the request method is HEAD', function(){
    it('should ignore the body', function(done){
      var app = express();

      app.use(function(req, res){
        res.send('yay');
      });

      request(app)
      .head('/')
      .end(function(res){
        res.body.should.equal('');
        done();
      })
    })
  })

  describe('when .statusCode is 204', function(){
    it('should strip Content-* fields & body', function(done){
      var app = express();

      app.use(function(req, res){
        res.status(204).send('foo');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.not.have.property('content-type');
        res.headers.should.not.have.property('content-length');
        res.body.should.equal('');
        done();
      })
    })
  })
  
  describe('when .statusCode is 304', function(){
    it('should strip Content-* fields & body', function(done){
      var app = express();

      app.use(function(req, res){
        res.status(304).send('foo');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.not.have.property('content-type');
        res.headers.should.not.have.property('content-length');
        res.body.should.equal('');
        done();
      })
    })
  })
})
