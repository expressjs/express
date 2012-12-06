
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
      .expect('', done);
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
      .expect('', done);
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
      .expect('Created')
      .expect(201, done);
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
      .expect('Created :)')
      .expect(201, done);
    })
  })

  describe('.send(body, code)', function(){
    it('should be supported for backwards compat', function(done){
      var app = express();

      app.use(function(req, res){
        res.send('Bad!', 400);
      });

      request(app)
      .get('/')
      .expect('Bad!')
      .expect(400, done);
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
      .end(function(err, res){
        res.headers.should.have.property('content-type', 'text/html; charset=utf-8');
        res.text.should.equal('<p>hey</p>');
        res.statusCode.should.equal(200);
        done();
      })
    })

    it('should set ETag', function(done){
      var app = express();

      app.use(function(req, res){
        var str = Array(1024 * 2).join('-');
        res.send(str);
      });

      request(app)
      .get('/')
      .expect('ETag', '"-1498647312"')
      .end(done);
    })
    
    it('should not override Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/plain').send('hey');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/plain')
      .expect('hey')
      .expect(200, done);
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
      .end(function(err, res){
        res.headers.should.have.property('content-type', 'application/octet-stream');
        res.text.should.equal('hello');
        res.statusCode.should.equal(200);
        done();
      })
    })

    it('should set ETag', function(done){
      var app = express();

      app.use(function(req, res){
        var str = Array(1024 * 2).join('-');
        res.send(new Buffer(str));
      });

      request(app)
      .get('/')
      .expect('ETag', '"-1498647312"')
      .end(done);
    })

    it('should not override Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/plain').send(new Buffer('hey'));
      });

      request(app)
      .get('/')
      .end(function(err, res){
        res.headers.should.have.property('content-type', 'text/plain');
        res.text.should.equal('hey');
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
      .end(function(err, res){
        res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
        res.text.should.equal('{"name":"tobi"}');
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
      .expect('', done);
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
      .end(function(err, res){
        res.headers.should.not.have.property('content-type');
        res.headers.should.not.have.property('content-length');
        res.text.should.equal('');
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
      .end(function(err, res){
        res.headers.should.not.have.property('content-type');
        res.headers.should.not.have.property('content-length');
        res.text.should.equal('');
        done();
      })
    })
  })

  it('should always check regardless of length', function(done){
    var app = express();

    app.use(function(req, res, next){
      res.set('ETag', 'asdf');
      res.send('hey');
    });

    request(app)
    .get('/')
    .set('If-None-Match', 'asdf')
    .expect(304, done);
  })

  it('should respond with 304 Not Modified when fresh', function(done){
    var app = express();

    app.use(function(req, res){
      var str = Array(1024 * 2).join('-');
      res.send(str);
    });

    request(app)
    .get('/')
    .set('If-None-Match', '"-1498647312"')
    .expect(304, done);
  })

  it('should not perform freshness check unless 2xx or 304', function(done){
    var app = express();

    app.use(function(req, res, next){
      res.status(500);
      res.set('ETag', 'asdf');
      res.send('hey');
    });

    request(app)
    .get('/')
    .set('If-None-Match', 'asdf')
    .expect('hey')
    .expect(500, done);
  })

  it('should not support jsonp callbacks', function(done){
    var app = express();

    app.use(function(req, res){
      res.send({ foo: 'bar' });
    });

    request(app)
    .get('/?callback=foo')
    .expect('{"foo":"bar"}', done);
  })

  describe('"etag" setting', function(){
    describe('when enabled', function(){
      it('should send ETag ', function(done){
        var app = express();

        app.use(function(req, res){
          var str = Array(1024 * 2).join('-');
          res.send(str);
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.headers.should.have.property('etag', '"-1498647312"');
          done();
        });
      });
    });

    describe('when disabled', function(){
      it('should send no ETag', function(done){
        var app = express();

        app.use(function(req, res){
          var str = Array(1024 * 2).join('-');
          res.send(str);
        });

        app.disable('etag');

        request(app)
        .get('/')
        .end(function(err, res){
          res.headers.should.not.have.property('etag');
          done();
        });
      });

      it('should send ETag when manually set', function(done){
        var app = express();

        app.disable('etag');

        app.use(function(req, res){
          res.set('etag', 1);
          res.send(200);
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.headers.should.have.property('etag');
          done();
        });
      });
    });
  })
})
